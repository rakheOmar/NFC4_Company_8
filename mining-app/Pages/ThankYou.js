import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ThankYou = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🎉 Thank You!</Text>
      <Text style={styles.message}>
        Your response has been recorded. We appreciate your input towards improving mining safety and sustainability.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefce8", // light yellow
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#374151", // slate-700
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#374151",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 24,
  },
});

export default ThankYou;
