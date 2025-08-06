import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const SalaryAttendance = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>💰 Salary & Attendance</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.label}>This Month</Text>
          <Text style={styles.value}>{formatCurrency(data.thisMonth)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.label}>Attendance</Text>
          <Text style={styles.value}>{data.attendance}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.label}>Monthly Progress</Text>
          <Text style={styles.value}>{data.progress}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${data.progress}%` }]} />
        </View>
      </View>

      <View style={styles.breakdown}>
        <Text style={styles.breakdownText}>
          <Text style={styles.label}>Base Salary: </Text>
          {formatCurrency(data.base)}
        </Text>
        <Text style={styles.breakdownText}>
          <Text style={styles.label}>Safety Bonus: </Text>
          <Text style={styles.green}>+ {formatCurrency(data.safetyBonus)}</Text>
        </Text>
        <Text style={styles.breakdownText}>
          <Text style={styles.label}>Overtime: </Text>
          <Text style={styles.green}>+ {formatCurrency(data.overtime)}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <FontAwesome5 name="credit-card" size={16} color="#fff" />
        <Text style={styles.buttonText}> View Payslip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  summaryBox: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBarBackground: {
    backgroundColor: "#e0e0e0",
    height: 8,
    borderRadius: 4,
  },
  progressBarFill: {
    backgroundColor: "#3498db",
    height: 8,
    borderRadius: 4,
  },
  breakdown: {
    marginBottom: 16,
  },
  breakdownText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },
  green: {
    color: "green",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
});

export default SalaryAttendance;
