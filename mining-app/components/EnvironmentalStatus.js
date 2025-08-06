import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// AQI interpretation helper
const getAqiInfo = (aqi) => {
  if (aqi <= 50) return { status: "Good", color: "#22C55E" };
  if (aqi <= 100) return { status: "Moderate", color: "#FACC15" };
  if (aqi <= 150) return { status: "Unhealthy (Sensitive)", color: "#F97316" };
  if (aqi <= 200) return { status: "Unhealthy", color: "#EF4444" };
  if (aqi <= 300) return { status: "Very Unhealthy", color: "#8B5CF6" };
  return { status: "Hazardous", color: "#7F1D1D" };
};

const EnvironmentalStatus = ({ data }) => {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAqi = async () => {
      const apiKey = process.env.EXPO_PUBLIC_AQI_API_KEY;
      const city = "mumbai";
      const url = `https://api.waqi.info/feed/${city}/?token=${apiKey}`;

      try {
        const res = await fetch(url);
        const result = await res.json();
        if (result.status !== "ok") {
          throw new Error("API Error");
        }
        setAqiData(result.data);
      } catch (err) {
        setError("Failed to fetch AQI data");
      } finally {
        setLoading(false);
      }
    };

    fetchAqi();
  }, []);

  const aqiInfo = aqiData ? getAqiInfo(aqiData.aqi) : null;

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Environmental Status</Text>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <FontAwesome5 name="thermometer-half" size={18} color="#EF4444" />
          <Text style={styles.label}>Temperature</Text>
        </View>
        <Text style={styles.value}>{data.temperature}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <FontAwesome5 name="wind" size={18} color="#3B82F6" />
          <Text style={styles.label}>Air Quality</Text>
        </View>
        {loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <Text
            style={[
              styles.badge,
              { backgroundColor: aqiInfo.color },
            ]}
          >
            {aqiData.aqi} - {aqiInfo.status}
          </Text>
        )}
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <FontAwesome5 name="smog" size={18} color="#6B7280" />
          <Text style={styles.label}>Gas Levels</Text>
        </View>
        <Text style={[styles.value, { color: "#22C55E" }]}>{data.gasLevels}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <FontAwesome5 name="map-marker-alt" size={18} color="#6B7280" />
          <Text style={styles.label}>Location</Text>
        </View>
        <Text style={styles.value}>{data.location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1F2937",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    marginLeft: 8,
    fontSize: 15,
    color: "#4B5563",
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#111827",
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    color: "#fff",
    borderRadius: 20,
    fontWeight: "600",
    fontSize: 13,
  },
  loading: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  error: {
    fontSize: 13,
    color: "#EF4444",
  },
});

export default EnvironmentalStatus;
