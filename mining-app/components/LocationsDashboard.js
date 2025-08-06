import React from "react";
import { View, Text, StyleSheet } from "react-native";
import EnvironmentalMap from "./EnvironmentalMap";
import { FontAwesome5 } from "@expo/vector-icons";

const EnvironmentalMonitoring = () => (
  <View style={styles.monitoringContainer}>
    <Text style={styles.heading}>Regional Monitoring</Text>

    <View style={styles.metricsContainer}>
      <View style={styles.metricBox}>
        <FontAwesome5 name="thermometer-half" size={28} color="#ef4444" style={styles.icon} />
        <Text style={styles.metricLabel}>Avg Temperature</Text>
        <Text style={styles.metricValue}>29°C</Text>
      </View>
      <View style={styles.metricBox}>
        <FontAwesome5 name="wind" size={28} color="#3b82f6" style={styles.icon} />
        <Text style={styles.metricLabel}>Air Quality</Text>
        <Text style={[styles.metricValue, { color: "#facc15" }]}>Moderate</Text>
      </View>
    </View>

    <View style={styles.statusContainer}>
      {[
        { label: "Gas Level Monitoring", value: "Normal" },
        { label: "Ventilation System", value: "Optimal" },
        { label: "Emergency Systems", value: "Active" },
      ].map((item, index) => (
        <View key={index} style={styles.statusRow}>
          <Text style={styles.statusLabel}>{item.label}</Text>
          <Text style={styles.statusBadge}>{item.value}</Text>
        </View>
      ))}
    </View>
  </View>
);

const LocationsDashboard = () => {
  return (
    <View style={styles.container}>
      <EnvironmentalMap />
      <EnvironmentalMonitoring />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  monitoringContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricBox: {
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginBottom: 6,
  },
  metricLabel: {
    fontWeight: "bold",
    color: "#374151",
  },
  metricValue: {
    fontSize: 20,
    color: "#4b5563",
  },
  statusContainer: {
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statusLabel: {
    color: "#4b5563",
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 13,
    fontWeight: "600",
  },
});

export default LocationsDashboard;
