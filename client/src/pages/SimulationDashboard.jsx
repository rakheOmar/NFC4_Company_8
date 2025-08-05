import React, { useState, useEffect, useRef } from "react";
import axios from "@/lib/axios"; // your custom axios instance
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  MapContainer, TileLayer, Marker, Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertCircle, FileTerminal, ShieldAlert } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "...",
  iconUrl: "...",
  shadowUrl: "...",
});

const SimulationDashboard = () => {
  // State
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const intervalRef = useRef(null);

  // Data
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [workers, setWorkers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [carbonFootprint, setCarbonFootprint] = useState(0);

  // --- Utility Logging ---
  const logMessage = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) =>
      [`[${timestamp}] [${type.toUpperCase()}] ${message}`, ...prevLogs].slice(0, 100)
    );
  };

  // --- Fetching Data ---
  // Fetch all sites once on mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data } = await axios.get("/api/sites");
        setSites(data);
        if (data.length > 0) setSelectedSite(data[0]._id); // default select first site
      } catch (err) {
        setSites([]);
        logMessage("Error fetching sites.", "error");
      }
    };
    fetchSites();
  }, []);

  // Fetch site-related data when selectedSite changes
  useEffect(() => {
    if (!selectedSite) return;
    const fetchAll = async () => {
      try {
        const [
          usersRes,
          equipmentRes,
          sensorsRes,
        ] = await Promise.all([
          axios.get(`/api/sites/${selectedSite}/users`),
          axios.get(`/api/sites/${selectedSite}/equipment`),
          axios.get(`/api/sites/${selectedSite}/sensors`),
        ]);
        setWorkers(usersRes.data);
        setEquipments(equipmentRes.data);
        setSensors(sensorsRes.data);
        setSensorReadings([]);
        setIncidents([]);
        setCarbonFootprint(0);
        logMessage(`Loaded site data for ${selectedSite}`, "success");
      } catch (err) {
        logMessage("Error fetching site data.", "error");
        setWorkers([]); setEquipments([]); setSensors([]);
      }
    };
    fetchAll();
  }, [selectedSite]);

  // --- Simulation Logic (Unchanged except using backend data) ---
  const runSimulationStep = () => {
    logMessage("Running simulation step...");

    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => {
        // Simulate movement and PPE violation
        const newCoords = [
          w.currentLocation.coordinates[0] + (Math.random() - 0.5) * 0.0001,
          w.currentLocation.coordinates[1] + (Math.random() - 0.5) * 0.0001,
        ];
        const newPpeStatus = { ...w.ppeStatus };

        // Simulate PPE violation
        if (Math.random() < 0.05 && newPpeStatus.helmet) {
          newPpeStatus.helmet = false;
          const incident = {
            _id: `inc${Date.now()}`,
            type: "PPE_VIOLATION",
            description: `${w.fullname} detected without helmet.`,
            severity: "Medium",
            timestamp: new Date(),
            location: { coordinates: newCoords },
            involvedUsers: [w._id],
          };
          setIncidents((prev) => [incident, ...prev]);
          logMessage(`Generated Incident: ${incident.description}`, "warning");
          toast.warning(`[${incident.severity}] ${incident.type}`, { description: incident.description });
        } else {
          newPpeStatus.helmet = true;
        }

        return { ...w, currentLocation: { coordinates: newCoords }, ppeStatus: newPpeStatus };
      })
    );

    // Equipment + carbon simulation
    let currentEmissions = 0;
    const CO2_PER_LITER_DIESEL = 2.68;
    const CO2_PER_KWH_ELECTRICITY = 0.82;
    setEquipments((prevEquip) =>
      prevEquip.map((e) => {
        let newRuntimeHours = e.runtimeHours;
        if (e.status === "Operational") {
          newRuntimeHours += 1 / 60;
          const emissionFactor = 2 / 3600;
          if (e.fuelType === "Diesel") {
            currentEmissions += e.consumptionRate * emissionFactor * CO2_PER_LITER_DIESEL;
          } else if (e.fuelType === "Electric") {
            currentEmissions += e.consumptionRate * emissionFactor * CO2_PER_KWH_ELECTRICITY;
          }
        }
        return { ...e, runtimeHours: newRuntimeHours };
      })
    );
    setCarbonFootprint((prev) => prev + currentEmissions);

    // Simulate relevant sensor readings for current site only
    const newReadings = sensors.map((s) => {
      let reading;
      switch (s.type) {
        case "AirQuality":
          reading = { co: (Math.random() * 5).toFixed(2), no2: (Math.random() * 2).toFixed(2) };
          break;
        case "GasLeak":
          reading = { methane: (Math.random() * 0.5).toFixed(3) };
          if (reading.methane > 0.45) {
            const incident = {
              _id: `inc${Date.now()}`,
              type: "HAZARD_REPORT",
              description: `High methane (${reading.methane}%) detected at ${s.locationDescription || ""}`,
              severity: "High",
              timestamp: new Date(),
            };
            setIncidents((prev) => [incident, ...prev]);
            logMessage(`Generated Incident: ${incident.description}`, "critical");
            toast.error(`[${incident.severity}] ${incident.type}`);
          }
          break;
        case "Temperature":
          reading = { value: (35 + Math.random() * 10).toFixed(2), unit: "°C" };
          break;
        default:
          reading = {};
      }
      return { sensorId: s._id, type: s.type, ...reading, timestamp: new Date() };
    });
    setSensorReadings((prev) => [...newReadings, ...prev].slice(0, 50));
  };

  // Handle simulation interval
  useEffect(() => {
    if (simulationRunning) {
      logMessage("Simulation started.", "success");
      intervalRef.current = setInterval(runSimulationStep, 2000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      logMessage("Simulation stopped.", "error");
    }
    return () => clearInterval(intervalRef.current);
  }, [simulationRunning, sensors, workers, equipments]);

  // For Chart
  const getSensorChartData = () => (
    sensorReadings
      .filter((r) => r.type === "AirQuality")
      .slice(0, 10)
      .reverse()
      .map((d) => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        CO: parseFloat(d.co),
        NO2: parseFloat(d.no2),
      }))
  );

  // --- Render ---
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Mine Operations Simulation
            </h1>
            {/* --- SITE SELECTOR DROPDOWN --- */}
            <select
              className="mr-4 px-3 py-2 border rounded text-base"
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              disabled={sites.length === 0}
            >
              {sites.length === 0 && <option>Loading sites...</option>}
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.name}
                </option>
              ))}
            </select>
            <Button
              onClick={() => setSimulationRunning(!simulationRunning)}
              variant={simulationRunning ? "destructive" : "default"}
              className={
                !simulationRunning ? "bg-green-600 hover:bg-green-700 dark:text-white" : ""
              }
              disabled={!selectedSite}
            >
              {simulationRunning ? "Stop Simulation" : "Start Simulation"}
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Monitoring Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <MapContainer
                    center={
                      sites.find((s) => s._id === selectedSite)?.location?.coordinates ||
                      [23.74, 86.42]
                    }
                    zoom={15}
                    style={{ height: "450px", width: "100%", borderRadius: "0.5rem" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {workers.map((w) => (
                      <Marker key={w._id} position={w.currentLocation.coordinates}>
                        <Popup>
                          {w.fullname} ({w.role}) <br /> Helmet: {w.ppeStatus.helmet ? "✅" : "❌"}
                        </Popup>
                      </Marker>
                    ))}
                    {equipments.map((e) => (
                      <Marker key={e._id} position={e.currentLocation.coordinates}>
                        <Popup>
                          {e.name} ({e.type}) <br /> Status: {e.status}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </CardContent>
              </Card>
              {/* ... Rest is UNCHANGED (Incidents, etc) ... */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" /> Safety & Incident Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 overflow-y-auto pr-2">
                  {incidents.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                      <ShieldAlert className="h-10 w-10 mb-2" />
                      <p>No incidents reported yet.</p>
                      <p className="text-sm">All systems are nominal.</p>
                    </div>
                  )}
                  {incidents.map((inc) => (
                    <Alert
                      key={inc._id}
                      variant={inc.severity === "High" ? "destructive" : "default"}
                      className="mb-3"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle className="font-bold">
                        [{inc.severity.toUpperCase()}] {inc.type.replace("_", " ")}
                      </AlertTitle>
                      <AlertDescription>
                        {inc.description} at {new Date(inc.timestamp).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTerminal className="h-5 w-5" /> Simulation Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-48 bg-slate-900 text-white font-mono text-xs p-3 rounded-md overflow-y-auto">
                  {logs.map((log, i) => (
                    <p
                      key={i}
                      className={
                        log.includes("[CRITICAL]")
                          ? "text-red-400"
                          : log.includes("[WARNING]")
                          ? "text-yellow-400"
                          : log.includes("[SUCCESS]")
                          ? "text-green-400"
                          : "text-slate-300"
                      }
                    >
                      {log}
                    </p>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Footprint Estimation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                    {carbonFootprint.toFixed(2)} kg CO₂
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total emissions since simulation start.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Sensor Data (Air Quality)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                      data={getSensorChartData()}
                      margin={{ top: 24, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="time" stroke="hsl(var(--primary))" fontSize={12} />
                      <YAxis stroke="hsl(var(--primary))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="CO" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="NO2" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default SimulationDashboard;
