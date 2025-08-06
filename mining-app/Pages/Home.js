import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import HeroSection from "../components/HeroSection"; // Adjust if renamed or moved
import LiveOverview from "../components/LiveOverview"; // Adjust if renamed or moved

/**
 * Home Component (React Native)
 *
 * This is the landing screen for the app. It combines the HeroSection and LiveOverview components.
 */
const Home = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeroSection />
      <LiveOverview />
      {/* Add more sections if needed */}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#f9fafb", // Equivalent to Tailwind's bg-gray-50
  },
});
