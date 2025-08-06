import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from '../lib/axios'; // Adjust your path
import { VictoryLine, VictoryChart, VictoryAxis, VictoryLegend } from 'victory-native';
import { Button } from 'react-native-paper'; // Or your own component
import Toast from 'react-native-toast-message';

const SimulationDashboard = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const intervalRef = useRef(null);

  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [carbonFootprint, setCarbonFootprint] = useState(0);

  const logMessage = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] [${type.toUpperCase()}] ${message}`, ...prev].slice(0, 100));
  };

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data } = await axios.get('/api/sites');
        setSites(data);
        if (data.length > 0) setSelectedSite(data[0]);
      } catch (err) {
        logMessage('Error fetching sites.', 'error');
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (!selectedSite?._id) return;
    const fetchData = async () => {
      try {
        const [u, e, s] = await Promise.all([
          axios.get(`/api/sites/${selectedSite._id}/users`),
          axios.get(`/api/sites/${selectedSite._id}/equipment`),
          axios.get(`/api/sites/${selectedSite._id}/sensors`)
        ]);
        setWorkers(u.data);
        setEquipments(e.data);
        setSensors(s.data);
        setSensorReadings([]);
        setIncidents([]);
        setCarbonFootprint(0);
        logMessage(`Loaded site data for ${selectedSite.name}`, 'success');
      } catch {
        logMessage('Error fetching site data.', 'error');
      }
    };
    fetchData();
  }, [selectedSite]);

  const runSimulationStep = () => {
    logMessage('Running simulation step...');
    setWorkers(prev =>
      prev.map(w => {
        const coords = [
          w.currentLocation.coordinates[0] + (Math.random() - 0.5) * 0.0001,
          w.currentLocation.coordinates[1] + (Math.random() - 0.5) * 0.0001
        ];
        const newPPE = { ...w.ppeStatus };
        if (Math.random() < 0.05) {
          newPPE.helmet = false;
          const incident = {
            id: Date.now().toString(),
            type: 'PPE_VIOLATION',
            description: `${w.fullname} detected without helmet.`,
            severity: 'Medium',
            location: coords,
            timestamp: new Date().toISOString()
          };
          setIncidents(prev => [incident, ...prev]);
          Toast.show({ type: 'info', text1: incident.description });
        } else {
          newPPE.helmet = true;
        }
        return { ...w, currentLocation: { coordinates: coords }, ppeStatus: newPPE };
      })
    );

    let emissions = 0;
    setEquipments(prev =>
      prev.map(e => {
        let hours = e.runtimeHours;
        if (e.status === 'Operational') {
          hours += 1 / 60;
          const rate = e.fuelType === 'Diesel' ? 2.68 : 0.82;
          emissions += e.consumptionRate * (2 / 3600) * rate;
        }
        return { ...e, runtimeHours: hours };
      })
    );
    setCarbonFootprint(prev => prev + emissions);

    const newReadings = sensors.map(s => {
      const reading = {
        id: Date.now() + Math.random(),
        sensorId: s._id,
        type: s.type,
        timestamp: new Date().toISOString()
      };
      if (s.type === 'AirQuality') {
        reading.co = parseFloat((Math.random() * 5).toFixed(2));
        reading.no2 = parseFloat((Math.random() * 2).toFixed(2));
      }
      return reading;
    });

    setSensorReadings(prev => [...newReadings, ...prev].slice(0, 50));
  };

  useEffect(() => {
    if (simulationRunning) {
      logMessage('Simulation started.', 'success');
      intervalRef.current = setInterval(runSimulationStep, 2000);
    } else {
      clearInterval(intervalRef.current);
      logMessage('Simulation stopped.', 'info');
    }
    return () => clearInterval(intervalRef.current);
  }, [simulationRunning]);

  const chartData = sensorReadings
    .filter(r => r.type === 'AirQuality')
    .slice(0, 10)
    .reverse()
    .map(d => ({
      time: new Date(d.timestamp).toLocaleTimeString(),
      CO: d.co,
      NO2: d.no2
    }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mine Operations Simulation</Text>
      <View style={styles.controls}>
        <Text>Select Site: {selectedSite?.name}</Text>
        <Button
          onPress={() => setSimulationRunning(!simulationRunning)}
          mode={simulationRunning ? 'contained' : 'outlined'}
          buttonColor={simulationRunning ? 'red' : 'green'}
        >
          {simulationRunning ? 'Stop' : 'Start'} Simulation
        </Button>
      </View>

      <MapView
        style={styles.map}
        region={{
          latitude: selectedSite?.location?.coordinates[0] || 23.74,
          longitude: selectedSite?.location?.coordinates[1] || 86.42,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }}
      >
        {workers.map(w => (
          <Marker
            key={w._id}
            coordinate={{
              latitude: w.currentLocation.coordinates[0],
              longitude: w.currentLocation.coordinates[1]
            }}
            pinColor={w.ppeStatus.helmet ? 'green' : 'red'}
          >
            <Callout>
              <Text>{w.fullname} ({w.role})</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Air Quality (CO & NO₂)</Text>
        <VictoryChart height={220}>
          <VictoryLegend x={75} y={0} orientation="horizontal" gutter={20}
            data={[{ name: "CO", symbol: { fill: "tomato" } }, { name: "NO2", symbol: { fill: "green" } }]}
          />
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryLine data={chartData} x="time" y="CO" style={{ data: { stroke: "tomato" } }} />
          <VictoryLine data={chartData} x="time" y="NO2" style={{ data: { stroke: "green" } }} />
        </VictoryChart>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Carbon Footprint</Text>
        <Text style={styles.stat}>{carbonFootprint.toFixed(2)} kg CO₂</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Incidents</Text>
        {incidents.length === 0 ? (
          <Text style={{ color: '#777' }}>No incidents yet.</Text>
        ) : (
          incidents.map((i, idx) => (
            <Text key={idx} style={{ marginBottom: 4 }}>
              [{i.severity}] {i.description}
            </Text>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Logs</Text>
        <FlatList
          data={logs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.log}>{item}</Text>}
        />
      </View>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  map: { width: '100%', height: 300, marginBottom: 20 },
  section: { marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
  stat: { fontSize: 22, fontWeight: 'bold', color: '#1f2937' },
  log: { fontSize: 12, color: '#333' }
});

export default SimulationDashboard;
