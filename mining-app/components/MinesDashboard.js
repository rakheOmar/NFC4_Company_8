// MinesDashboard.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Dummy Data for Mines
const minesData = [
  {
    name: "Central Mine A",
    location: "Jharia, Jharkhand",
    status: "Safe",
    activeWorkers: "24/30",
    production: "1250t",
    capacity: 80,
    envScore: 85,
    lastInspection: "1/15/2024",
  },
  {
    name: "Eastern Mine B",
    location: "Raniganj, West Bengal",
    status: "Warning",
    activeWorkers: "18/25",
    production: "980t",
    capacity: 72,
    envScore: 78,
    lastInspection: "1/14/2024",
  },
  {
    name: "Western Mine C",
    location: "Korba, Chhattisgarh",
    status: "Safe",
    activeWorkers: "32/40",
    production: "1520t",
    capacity: 80,
    envScore: 92,
    lastInspection: "1/16/2024",
  },
];

// Reusable Mine Card Component
const MineCard = ({ mine }) => {
  const statusColor =
    mine.status === "Safe"
      ? { backgroundColor: "#D1FAE5", color: "#065F46" }
      : { backgroundColor: "#FEF3C7", color: "#92400E" };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.mineName}>{mine.name}</Text>
          <Text style={styles.location}>
            <FontAwesome name="map-marker" size={14} color="#6B7280" /> {mine.location}
          </Text>
        </View>
        <Text style={[styles.statusTag, { backgroundColor: statusColor.backgroundColor, color: statusColor.color }]}>
          {mine.status}
        </Text>
      </View>

      {/* Info Row */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Active Workers</Text>
          <Text style={styles.infoValue}>{mine.activeWorkers}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Production Today</Text>
          <Text style={styles.infoValue}>{mine.production}</Text>
        </View>
      </View>

      {/* Progress Bars */}
      <View style={styles.progressGroup}>
        <Text style={styles.progressLabel}>Capacity Utilization</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${mine.capacity}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{mine.capacity}%</Text>
      </View>

      <View style={styles.progressGroup}>
        <Text style={styles.progressLabel}>Environmental Score</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${mine.envScore}%` }]} />
        </View>
        <Text style={styles.progressPercent}>{mine.envScore}%</Text>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Last Inspection: {mine.lastInspection}</Text>
    </View>
  );
};

const MinesDashboard = () => {
  return (
    <FlatList
      data={minesData}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => <MineCard mine={item} />}
      contentContainerStyle={styles.container}
      numColumns={1} // You can change to 2 for side-by-side cards on tablets
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#F3F4F6',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  location: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  statusTag: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  infoBox: {
    alignItems: 'center',
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  progressGroup: {
    marginTop: 10,
  },
  progressLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#10B981',
  },
  progressPercent: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  footer: {
    marginTop: 10,
    fontSize: 12,
    color: '#6B7280',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
});

export default MinesDashboard;
