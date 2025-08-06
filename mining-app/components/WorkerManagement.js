import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Button, Menu, Divider } from "react-native-paper";

const workersData = [
  {
    id: "MIN-2024-001",
    name: "John Doe",
    role: "Mining Operator",
    shift: "Day Shift",
    location: "Tunnel B-7",
    status: "Active",
    safetyScore: 98,
    lastSeen: "2 min ago",
  },
  {
    id: "MIN-2024-002",
    name: "Sarah Wilson",
    role: "Safety Inspector",
    shift: "Day Shift",
    location: "Main Hub",
    status: "Active",
    safetyScore: 100,
    lastSeen: "1 min ago",
  },
  {
    id: "MIN-2024-003",
    name: "Mike Johnson",
    role: "Equipment Operator",
    shift: "Night Shift",
    location: "Tunnel A-3",
    status: "On Break",
    safetyScore: 95,
    lastSeen: "15 min ago",
  },
  {
    id: "MIN-2024-004",
    name: "Alex Chen",
    role: "Mining Engineer",
    shift: "Day Shift",
    location: "Control Room",
    status: "Active",
    safetyScore: 97,
    lastSeen: "5 min ago",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "#4CAF50";
    case "On Break":
      return "#FFC107";
    default:
      return "#9E9E9E";
  }
};

const WorkerManagement = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Worker Management</Text>

      {/* Search + Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <FontAwesome name="search" size={16} color="#888" style={styles.searchIcon} />
          <TextInput placeholder="Search workers..." style={styles.input} />
        </View>
        <View style={styles.dropdownBox}>
          <Text>Status: </Text>
          <TextInput
            value={statusFilter}
            onChangeText={setStatusFilter}
            style={styles.dropdown}
            placeholder="All"
          />
        </View>
      </View>

      {/* Table Headers */}
      <ScrollView horizontal>
        <View>
          <View style={styles.tableHeader}>
            {["Worker", "Role", "Location", "Status", "Score", "Last Seen", "Actions"].map(
              (title, index) => (
                <Text key={index} style={styles.headerText}>{title}</Text>
              )
            )}
          </View>

          {/* Workers List */}
          <FlatList
            data={workersData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {/* Worker */}
                <View style={styles.workerCell}>
                  <View style={styles.avatar} />
                  <View>
                    <Text style={styles.boldText}>{item.name}</Text>
                    <Text style={styles.smallText}>{item.id}</Text>
                  </View>
                </View>

                {/* Role */}
                <View style={styles.cell}>
                  <Text>{item.role}</Text>
                  <Text style={styles.smallText}>{item.shift}</Text>
                </View>

                {/* Location */}
                <View style={styles.cell}>
                  <Text>{item.location}</Text>
                </View>

                {/* Status */}
                <View style={styles.cell}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                {/* Safety Score */}
                <View style={styles.cell}>
                  <Text>{item.safetyScore}%</Text>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${item.safetyScore}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Last Seen */}
                <View style={styles.cell}>
                  <Text>{item.lastSeen}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <FontAwesome5 name="eye" size={18} style={styles.icon} />
                  <FontAwesome5 name="cog" size={18} style={styles.icon} />
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkerManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 24,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 40,
  },
  dropdownBox: {
    minWidth: 120,
    justifyContent: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#eee",
    paddingBottom: 6,
    marginBottom: 4,
  },
  headerText: {
    fontWeight: "700",
    color: "#666",
    width: 110,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  workerCell: {
    flexDirection: "row",
    alignItems: "center",
    width: 110,
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ccc",
  },
  boldText: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 12,
    color: "#888",
  },
  cell: {
    width: 110,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  progressBarBackground: {
    width: 80,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 4,
    marginTop: 4,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: "#007bff",
    borderRadius: 4,
  },
  actions: {
    width: 100,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icon: {
    color: "#555",
  },
});
