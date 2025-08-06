import React from "react";
import { View, Text, StyleSheet } from "react-native";

const InfoCard = ({ icon, title, value, subtext, progress, alert }) => {
  const progressColor = alert ? "#dc3545" : "#007bff"; // red or primary blue
  const iconColor = alert ? "#dc3545" : "#0056b3"; // dark red or dark blue

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { color: iconColor }]}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.value}>{value}</Text>
        {subtext ? <Text style={styles.subtext}>{subtext}</Text> : null}
        {progress ? (
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressBar, { width: `${progress}%`, backgroundColor: progressColor }]}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrapper: {
    marginRight: 12,
    fontSize: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  body: {
    marginTop: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
  },
  subtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});

export default InfoCard;
