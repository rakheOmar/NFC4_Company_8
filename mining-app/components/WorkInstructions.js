import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <FontAwesome5 name="check-circle" size={20} color="#4CAF50" />;
    case "progress":
      return <MaterialIcons name="access-time" size={20} color="#2196F3" />;
    case "scheduled":
      return <MaterialCommunityIcons name="alert" size={20} color="#FFC107" />;
    default:
      return null;
  }
};

const WorkInstructions = ({ instructions }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        <FontAwesome5 name="clipboard" size={18} /> Today's Work Instructions
      </Text>

      <FlatList
        data={instructions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.instructionItem, styles[`status_${item.status}`]]}>
            <View style={styles.iconBox}>{getStatusIcon(item.status)}</View>
            <View style={styles.details}>
              <Text style={styles.instructionTitle}>{item.title}</Text>
              <Text style={styles.instructionDetail}>{item.detail}</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button}>
        <FontAwesome5 name="clipboard-list" size={16} color="#fff" />
        <Text style={styles.buttonText}> View All Instructions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WorkInstructions;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconBox: {
    width: 30,
    alignItems: "center",
    marginTop: 2,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  instructionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  instructionDetail: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // Optional: status-based styling (e.g. background or border)
  status_completed: {},
  status_progress: {},
  status_scheduled: {},
});
