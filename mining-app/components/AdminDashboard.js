import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import WorkerManagement from "./WorkerManagement";
import MinesDashboard from "./MinesDashboard";
import LocationsDashboard from "./LocationsDashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AdminInfoCard from "./AdminInfoCard";

const Header = ({ dashboardType }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{dashboardType} Dashboard</Text>
    <Text style={styles.subtitle}>Overview and management tools</Text>
  </View>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Workers");

  const renderContent = () => {
    switch (activeTab) {
      case "Workers":
        return <WorkerManagement />;
      case "Mines":
        return <MinesDashboard />;
      case "Locations":
        return <LocationsDashboard />;
      case "Analytics":
        return <AnalyticsDashboard />;
      default:
        return <WorkerManagement />;
    }
  };

  const tabs = ["Workers", "Mines", "Locations", "Analytics"];

  return (
    <ScrollView style={styles.container}>
      <Header dashboardType="Admin" />

      {/* Animated Card Section */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 800 }}
        style={styles.cardsContainer}
      >
        <AdminInfoCard
          title="Total Workers"
          value="74"
          trend="+5 from last week"
          icon={<Feather name="users" size={24} color="black" />}
        />
        <AdminInfoCard
          title="Active Now"
          value="3"
          subtext="60% of total workforce"
          icon={<FontAwesome5 name="chart-line" size={24} color="black" />}
        />
        <AdminInfoCard
          title="Active Mines"
          value="3"
          subtext="All operational"
          icon={<Feather name="map-pin" size={24} color="black" />}
        />
        <AdminInfoCard
          title="Safety Score"
          value="96%"
          subtext="Progress: 96%"
          icon={<FontAwesome5 name="shield-alt" size={24} color="black" />}
        />
      </MotiView>

      {/* Tab Buttons */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTab,
            ]}
          >
            <Text style={activeTab === tab ? styles.activeTabText : styles.tabText}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 500 }}
        style={styles.tabContent}
      >
        {renderContent()}
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subtitle: {
    color: "#6B7280",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    marginRight: 8,
    marginBottom: 8,
  },
  activeTab: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    color: "#374151",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  tabContent: {
    marginTop: 10,
  },
});

export default AdminDashboard;
