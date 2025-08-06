import React, { useState } from "react";
import { ScrollView, View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import RNPickerSelect from "react-native-picker-select";

const screenWidth = Dimensions.get("window").width;

const locations = ["All", "Dhanbad", "Korba", "Singrauli"];

const sentimentData = {
  "Air Quality": [
    { month: "Jan", positive: 20, neutral: 10, negative: 5 },
    { month: "Feb", positive: 25, neutral: 8, negative: 7 },
    { month: "Mar", positive: 22, neutral: 12, negative: 6 },
    { month: "Apr", positive: 30, neutral: 10, negative: 3 },
    { month: "May", positive: 27, neutral: 15, negative: 5 },
    { month: "Jun", positive: 24, neutral: 14, negative: 4 },
    { month: "Jul", positive: 26, neutral: 13, negative: 6 },
    { month: "Aug", positive: 29, neutral: 11, negative: 5 },
    { month: "Sep", positive: 31, neutral: 9, negative: 4 },
    { month: "Oct", positive: 28, neutral: 10, negative: 6 },
    { month: "Nov", positive: 30, neutral: 8, negative: 5 },
    { month: "Dec", positive: 33, neutral: 7, negative: 4 },
  ],
  "General Safety": [
    { month: "Jan", positive: 18, neutral: 14, negative: 6 },
    { month: "Feb", positive: 21, neutral: 13, negative: 6 },
    { month: "Mar", positive: 23, neutral: 12, negative: 5 },
    { month: "Apr", positive: 25, neutral: 11, negative: 4 },
    { month: "May", positive: 24, neutral: 12, negative: 5 },
    { month: "Jun", positive: 26, neutral: 13, negative: 6 },
    { month: "Jul", positive: 27, neutral: 11, negative: 5 },
    { month: "Aug", positive: 29, neutral: 10, negative: 5 },
    { month: "Sep", positive: 28, neutral: 11, negative: 4 },
    { month: "Oct", positive: 30, neutral: 9, negative: 3 },
    { month: "Nov", positive: 32, neutral: 8, negative: 2 },
    { month: "Dec", positive: 34, neutral: 7, negative: 1 },
  ],
};

const pieData = {
  toolsUsed: [
    { name: "Yes", population: 80, color: "#10b981", legendFontColor: "#333", legendFontSize: 12 },
    { name: "No", population: 20, color: "#ef4444", legendFontColor: "#333", legendFontSize: 12 },
  ],
  equipmentFamiliarity: [
    {
      name: "Fully Aware",
      population: 60,
      color: "#10b981",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Somewhat Aware",
      population: 30,
      color: "#f59e0b",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Not Aware",
      population: 10,
      color: "#ef4444",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ],
};

export default function SurveyAnalysis() {
  const [location, setLocation] = useState("All");

  const totalResponses = 300;
  const positive = 190;
  const neutral = 70;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Survey Analysis</Text>

      <Text style={styles.label}>Filter by Location</Text>
      <RNPickerSelect
        onValueChange={(value) => setLocation(value)}
        value={location}
        items={locations.map((loc) => ({ label: loc, value: loc }))}
        style={pickerStyles}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Responses</Text>
          <Text style={styles.statValue}>{totalResponses}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Positive</Text>
          <Text style={[styles.statValue, { color: "#10b981" }]}>{positive}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Neutral</Text>
          <Text style={[styles.statValue, { color: "#f59e0b" }]}>{neutral}</Text>
        </View>
      </View>

      {Object.entries(sentimentData).map(([category, data]) => (
        <View key={category} style={styles.chartWrapper}>
          <Text style={styles.chartTitle}>{category} Sentiment Over Time</Text>
          <LineChart
            data={{
              labels: data.map((d) => d.month),
              datasets: [
                { data: data.map((d) => d.positive), color: () => "#10b981", strokeWidth: 2 },
                { data: data.map((d) => d.neutral), color: () => "#f59e0b", strokeWidth: 2 },
                { data: data.map((d) => d.negative), color: () => "#ef4444", strokeWidth: 2 },
              ],
              legend: ["Positive", "Neutral", "Negative"],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              labelColor: () => "#333",
            }}
            bezier
            style={{ marginVertical: 8, borderRadius: 8 }}
          />
        </View>
      ))}

      <View style={styles.pieSection}>
        <Text style={styles.chartTitle}>Do People Use Safety Tools?</Text>
        <PieChart
          data={pieData.toolsUsed}
          width={screenWidth - 32}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.pieSection}>
        <Text style={styles.chartTitle}>Familiarity with Safety Equipment</Text>
        <PieChart
          data={pieData.equipmentFamiliarity}
          width={screenWidth - 32}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  chartWrapper: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  pieSection: {
    marginBottom: 32,
  },
});

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 6,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
};
