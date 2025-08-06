import React, { useMemo } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Pie from 'react-native-pie-chart';
import { faker } from '@faker-js/faker';

const screenWidth = Dimensions.get('window').width;
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateMonthlySentiment = () => {
  return months.map(month => ({
    month,
    positive: faker.number.int({ min: 20, max: 40 }),
    neutral: faker.number.int({ min: 5, max: 20 }),
    negative: faker.number.int({ min: 2, max: 10 })
  }));
};

const generatePieData = () => ({
  toolsUsed: [
    { name: 'Yes', value: faker.number.int({ min: 60, max: 90 }) },
    { name: 'No', value: faker.number.int({ min: 10, max: 40 }) },
  ],
  equipmentFamiliarity: [
    { name: 'Fully Aware', value: faker.number.int({ min: 50, max: 80 }) },
    { name: 'Somewhat Aware', value: faker.number.int({ min: 10, max: 40 }) },
    { name: 'Not Aware', value: faker.number.int({ min: 5, max: 20 }) },
  ]
});

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const SentimentSummary = () => {
  const airQualityData = useMemo(generateMonthlySentiment, []);
  const safetyData = useMemo(generateMonthlySentiment, []);
  const pieData = useMemo(generatePieData, []);

  const totalResponses = useMemo(() => {
    let total = 0, pos = 0, neu = 0, neg = 0;
    airQualityData.forEach(item => {
      pos += item.positive;
      neu += item.neutral;
      neg += item.negative;
    });
    total = pos + neu + neg;
    return { total, pos, neu, neg };
  }, [airQualityData]);

  const extractLineData = (data) => ({
    labels: data.map(d => d.month),
    datasets: [
      {
        data: data.map(d => d.positive),
        color: () => COLORS[0],
        strokeWidth: 2,
      },
      {
        data: data.map(d => d.neutral),
        color: () => COLORS[1],
        strokeWidth: 2,
      },
      {
        data: data.map(d => d.negative),
        color: () => COLORS[2],
        strokeWidth: 2,
      },
    ],
    legend: ['Positive', 'Neutral', 'Negative'],
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Survey Analysis</Text>

      <View style={styles.grid}>
        <StatCard label="Total Responses" value={totalResponses.total} color="#3b82f6" />
        <StatCard label="Positive" value={totalResponses.pos} color="#10b981" />
        <StatCard label="Neutral" value={totalResponses.neu} color="#f59e0b" />
        <StatCard label="Negative" value={totalResponses.neg} color="#ef4444" />
      </View>

      <View style={styles.chartBlock}>
        <Text style={styles.chartTitle}>Air Quality Sentiment Over Time</Text>
        <LineChart
          data={extractLineData(airQualityData)}
          width={screenWidth - 30}
          height={250}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      <View style={styles.chartBlock}>
        <Text style={styles.chartTitle}>General Safety Sentiment Over Time</Text>
        <LineChart
          data={extractLineData(safetyData)}
          width={screenWidth - 30}
          height={250}
          chartConfig={chartConfig}
          bezier
        />
      </View>

      <View style={styles.pieWrapper}>
        <Text style={styles.chartTitle}>Do People Use Safety Tools?</Text>
        <Pie
          width={screenWidth * 0.4}
          height={screenWidth * 0.4}
          series={pieData.toolsUsed.map(item => item.value)}
          sliceColor={COLORS}
        />
      </View>

      <View style={styles.pieWrapper}>
        <Text style={styles.chartTitle}>Familiarity with Safety Equipment</Text>
        <Pie
          width={screenWidth * 0.4}
          height={screenWidth * 0.4}
          series={pieData.equipmentFamiliarity.map(item => item.value)}
          sliceColor={COLORS}
        />
      </View>
    </ScrollView>
  );
};

const StatCard = ({ label, value, color }) => (
  <View style={[styles.card, { borderColor: color }]}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={[styles.cardValue, { color }]}>{value}</Text>
  </View>
);

const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
  propsForDots: {
    r: "4",
    strokeWidth: "1",
    stroke: "#fff"
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9fafb" },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2
  },
  cardLabel: { fontSize: 14, color: '#6b7280' },
  cardValue: { fontSize: 22, fontWeight: 'bold' },
  chartBlock: { marginBottom: 30 },
  chartTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  pieWrapper: { alignItems: 'center', marginBottom: 30 }
});

export default SentimentSummary;
