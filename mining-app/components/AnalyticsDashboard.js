import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

const ProductionAnalytics = () => (
  <View style={styles.card}>
    <Text style={styles.heading}>
      <FontAwesome5 name="chart-bar" size={18} color="#6b7280" /> Production Analytics
    </Text>
    <View style={styles.row}>
      <View style={styles.metric}>
        <Text style={styles.primaryValue}>3.75k</Text>
        <Text style={styles.subText}>Today's Production (tons)</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.greenValue}>+12%</Text>
        <Text style={styles.subText}>vs Yesterday</Text>
      </View>
      <View style={styles.metric}>
        <Text style={styles.blueValue}>94%</Text>
        <Text style={styles.subText}>Target Achievement</Text>
      </View>
    </View>
  </View>
);

const SafetyMetrics = () => (
  <View style={styles.card}>
    <Text style={styles.heading}>
      <FontAwesome5 name="shield-alt" size={18} color="#6b7280" /> Safety Metrics
    </Text>
    <View style={styles.row}>
      <View style={styles.metricBox}>
        <FontAwesome5 name="check-circle" size={24} color="#28a745" />
        <Text style={styles.metricValue}>0</Text>
        <Text style={styles.subText}>Incidents Today</Text>
      </View>
      <View style={styles.metricBox}>
        <FontAwesome5 name="shield-virus" size={24} color="#2563eb" />
        <Text style={styles.metricValue}>256</Text>
        <Text style={styles.subText}>Days Accident-Free</Text>
      </View>
    </View>
    <View style={styles.compliance}>
      <View style={styles.complianceRow}>
        <Text style={styles.subTextBold}>Safety Compliance</Text>
        <Text style={styles.subTextBold}>96%</Text>
      </View>
      <ProgressBar progress={0.96} color="#2563eb" style={styles.progressBar} />
    </View>
  </View>
);

const AnalyticsDashboard = () => {
  return (
    <View style={styles.grid}>
      <ProductionAnalytics />
      <SafetyMetrics />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 8,
  },
  metric: {
    alignItems: "center",
    flex: 1,
  },
  metricBox: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
  },
  primaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  greenValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#28a745",
  },
  blueValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563eb",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginVertical: 4,
  },
  subText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  subTextBold: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "600",
  },
  compliance: {
    marginTop: 16,
  },
  complianceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 5,
  },
});

export default AnalyticsDashboard;
