// EnvironmentalMap.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";

// AQI Color + Label Helper
const getAqiInfo = (aqi) => {
  if (aqi === "-" || aqi === undefined) return { status: "N/A", color: "#9CA3AF" };
  const val = parseInt(aqi);
  if (val <= 50) return { status: "Good", color: "#22C55E" };
  if (val <= 100) return { status: "Moderate", color: "#FBBF24" };
  if (val <= 150) return { status: "Unhealthy for Sensitive", color: "#F97316" };
  if (val <= 200) return { status: "Unhealthy", color: "#EF4444" };
  if (val <= 300) return { status: "Very Unhealthy", color: "#A855F7" };
  return { status: "Hazardous", color: "#881337" };
};

const locationsToFetch = ["mumbai", "navi-mumbai", "thane", "bandra"];

const EnvironmentalMap = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllStationData = async () => {
      const apiKey = process.env.EXPO_PUBLIC_AQI_API_KEY;

      const fetchPromises = locationsToFetch.map((city) =>
        fetch(`https://api.waqi.info/feed/${city}/?token=${apiKey}`).then((res) => res.json())
      );

      try {
        const results = await Promise.allSettled(fetchPromises);
        const validStations = results
          .filter((r) => r.status === "fulfilled" && r.value.status === "ok")
          .map((r) => {
            const station = r.value.data;
            return {
              uid: station.idx,
              lat: station.city.geo[0],
              lon: station.city.geo[1],
              aqi: station.aqi,
              name: station.city.name,
              time: station.time.s,
            };
          });

        setStations(validStations);
      } catch (err) {
        console.error("Error fetching AQI data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStationData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading Map & Environmental Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.076,
          longitude: 72.8777,
          latitudeDelta: 0.6,
          longitudeDelta: 0.6,
        }}
      >
        {stations.map((station) => {
          const { color, status } = getAqiInfo(station.aqi);
          return (
            <Marker
              key={station.uid}
              coordinate={{ latitude: station.lat, longitude: station.lon }}
              pinColor={color}
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.title}>{station.name}</Text>
                  <Text style={{ color }}>AQI: {station.aqi} ({status})</Text>
                  <Text style={styles.timestamp}>
                    Updated: {new Date(station.time).toLocaleString()}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 600,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 12,
  },
  map: {
    flex: 1,
  },
  callout: {
    width: 200,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  loadingContainer: {
    height: 600,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 16,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default EnvironmentalMap;
