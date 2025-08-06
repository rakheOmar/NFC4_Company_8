// SentimentSummary.js (React Native version)
import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryAxis } from "victory-native";
import { faker } from "@faker-js/faker";
import { SafeAreaView } from "react-native-safe-area-context";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const generateMonthlySentiment = () =>
  months.map((month) => ({
    month,
    positive: faker.number.int({ min: 20, max: 40 }),
    neutral: faker.number.int({ min: 5, max: 20 }),
    negative: faker.number.int({ min: 2, max: 10 }),
  }));

const generatePieData = () => ({
  toolsUsed: [
    { x: "Yes", y: faker.number.int({ min: 60, max: 90 }) },
    { x: "No", y: faker.number.int({ min: 10, max: 40 }) },
  ],
  equipmentFamiliarity: [
    { x: "Fully Aware", y: faker.number.int({ min: 50, max: 80 }) },
    { x: "Somewhat Aware", y: faker.number.int({ min: 10, max: 40 }) },
    { x: "Not Aware", y: faker.number.int({ min: 5, max: 20 }) },
  ],
});

const SentimentSummary = () => {
  const airQualityData = useMemo(generateMonthlySentiment, []);
  const safetyData = useMemo(generateMonthlySentiment, []);
  const pieData = useMemo(generatePieData, []);

  const totalResponses = useMemo(() => {
    let total = 0, pos = 0, neu = 0, neg = 0;
    airQualityData.forEach((item) => {
      pos += item.positive;
      neu += item.neutral;
      neg += item.negative;
    });
    total = pos + neu + neg;
    return { total, pos, neu, neg };
  }, [airQualityData]);

  const chartWidth = Dimensions.get("window").width - 32;

  const transformToVictory = (key) =>
    airQualityData.map((item) => ({ x: item.month, y: item[key] }));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>📊 Survey Analysis</Text>

        <View style={styles.statsContainer}>
          <View style={styles.card}>
            <Text style={styles.label}>Total Responses</Text>
            <Text style={styles.value}>{totalResponses.total}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Positive</Text>
            <Text style={[styles.value, { color: "#10b981" }]}>{totalResponses.pos}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Neutral</Text>
            <Text style={[styles.value, { color: "#f59e0b" }]}>{totalResponses.neu}</Text>
          </View>
        </View>

        <Text style={styles.chartTitle}>Air Quality Sentiment Over Time</Text>
        <VictoryChart width={chartWidth} theme={VictoryTheme.material} domainPadding={10}>
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryLine data={transformToVictory("positive")} style={{ data: { stroke: "#10b981" } }} />
          <VictoryLine data={transformToVictory("neutral")} style={{ data: { stroke: "#f59e0b" } }} />
          <VictoryLine data={transformToVictory("negative")} style={{ data: { stroke: "#ef4444" } }} />
        </VictoryChart>

        <Text style={styles.chartTitle}>General Safety Sentiment Over Time</Text>
        <VictoryChart width={chartWidth} theme={VictoryTheme.material} domainPadding={10}>
          <VictoryAxis />
          <VictoryAxis dependentAxis />
          <VictoryLine data={transformToVictory("positive")} style={{ data: { stroke: "#10b981" } }} />
          <VictoryLine data={transformToVictory("neutral")} style={{ data: { stroke: "#f59e0b" } }} />
          <VictoryLine data={transformToVictory("negative")} style={{ data: { stroke: "#ef4444" } }} />
        </VictoryChart>

        <View style={styles.pieContainer}>
          <Text style={styles.chartTitle}>Do People Use Safety Tools?</Text>
          <VictoryPie data={pieData.toolsUsed} colorScale={["#10b981", "#ef4444"]} labelRadius={50} />
        </View>

        <View style={styles.pieContainer}>
          <Text style={styles.chartTitle}>Familiarity with Safety Equipment</Text>
          <VictoryPie
            data={pieData.equipmentFamiliarity}
            colorScale={["#10b981", "#f59e0b", "#ef4444"]}
            labelRadius={50}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scroll: {
    padding: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    shadowColor: "#ccc",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    color: "#1F2937",
  },
  pieContainer: {
    marginTop: 24,
    alignItems: "center",
  },
});

export default SentimentSummary;
