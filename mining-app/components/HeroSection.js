import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MotiView } from "moti";

const HeroSection = () => {
  const navigation = useNavigation();

  return (
    <ScrollView>
      {/* Top Light Section */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1000 }}
        style={styles.lightSection}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚡ Advanced Mining Intelligence</Text>
        </View>

        <Text style={styles.heading}>
          <Text style={styles.headingLine1}>Safety & Sustainability in{"\n"}</Text>
          <Text style={styles.headingLine2}>Coal Mining Operations</Text>
        </Text>

        <Text style={styles.description}>
          Real-time worker monitoring, AI-based safety alerts, carbon emission tracking, and R&D
          project management – all in one comprehensive platform for the future of coal mining.
        </Text>
      </MotiView>

      {/* Bottom Dark Section */}
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 1000, delay: 300 }}
        style={styles.darkSection}
      >
        <Text style={styles.subheading}>Ready to Transform Your Mining Operations?</Text>
        <Text style={styles.subDescription}>
          Join the future of coal mining with our comprehensive safety and sustainability platform.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("SentimentSummary")}
        >
          <Text style={styles.buttonText}>Explore Dashboard →</Text>
        </TouchableOpacity>
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  lightSection: {
    backgroundColor: "#fff",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: "#15803d",
    fontSize: 14,
    fontWeight: "600",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },
  headingLine1: {
    color: "#0f172a",
  },
  headingLine2: {
    color: "#a44406",
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 12,
    maxWidth: 340,
  },
  darkSection: {
    backgroundColor: "#a44406",
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  subheading: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subDescription: {
    color: "#f3f4f6",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default HeroSection;
