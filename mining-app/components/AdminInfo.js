import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AdminInfoCard = ({ title, value, subtext, trend, progress, icon }) => {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.icon}>{icon}</View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.value}>{value}</Text>

        {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
        {trend ? <Text style={styles.trend}>{trend}</Text> : null}

        {/* Progress Bar */}
        {progress ? (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  body: {
    marginTop: 12,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  trend: {
    fontSize: 12,
    color: "#10B981",
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#28a745",
    borderRadius: 4,
  },
});

export default AdminInfoCard;
