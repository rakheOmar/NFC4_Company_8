import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const VideoCommunication = () => {
  const [isAvailable, setIsAvailable] = useState(true);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        <FontAwesome name="video-camera" size={18} /> Video Communication
      </Text>

      <View style={styles.videoPlaceholder}>
        <FontAwesome name="video-camera" size={60} color="#aaa" />
        <Text style={styles.cameraOff}>Camera Off</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.controlButton}>
            <FontAwesome name="phone" size={16} color="#fff" />
            <Text style={styles.buttonText}>Call Supervisor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <FontAwesome name="users" size={16} color="#fff" />
            <Text style={styles.buttonText}>Team Meeting</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlButton, styles.emergencyButton]}>
            <FontAwesome name="exclamation-triangle" size={16} color="#fff" />
            <Text style={styles.buttonText}>Emergency</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.availability}>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            thumbColor={isAvailable ? "#4CAF50" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
          <Text style={styles.availableText}>Available</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    margin: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  videoPlaceholder: {
    alignItems: "center",
    marginBottom: 20,
  },
  cameraOff: {
    marginTop: 8,
    color: "#888",
    fontSize: 16,
  },
  controls: {
    justifyContent: "space-between",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    margin: 4,
  },
  emergencyButton: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  availability: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    justifyContent: "center",
  },
  availableText: {
    marginLeft: 8,
    fontSize: 14,
  },
});

export default VideoCommunication;
