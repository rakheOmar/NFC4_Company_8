// Dashboard.js
import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { MotiView } from "moti";
import Header from "./Header";
import InfoCard from "./InfoCard";
import WorkInstructions from "./WorkInstructions";
import SalaryAttendance from "./SalaryAttendance";
import VideoCommunication from "./VideoCommunication";
import EnvironmentalStatus from "./EnvironmentalStatus";
import Sidebar from "./Sidebar"; // May need mobile layout changes
import { FontAwesome5 } from "@expo/vector-icons";

const Dashboard = () => {
  const user = {
    name: "John Doe",
    id: "MIN-2024-001",
    level: "Level 3 Certified",
  };

  const environmentalData = {
    temperature: "24°C",
    airQuality: "Good",
    gasLevels: "Normal",
    location: "Tunnel B-7",
  };

  const salaryData = {
    thisMonth: 45000,
    attendance: "22/24",
    progress: 92,
    base: 40000,
    safetyBonus: 3000,
    overtime: 2000,
  };

  const instructions = [
    { id: 1, title: "Safety equipment check", status: "completed", detail: "Completed at 6:15 AM" },
    {
      id: 2,
      title: "Coal extraction - Section B",
      status: "progress",
      detail: "In progress - 65% complete",
    },
    { id: 3, title: "Equipment maintenance", status: "scheduled", detail: "Scheduled for 2:00 PM" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Sidebar can be conditionally rendered for tablets or modal-based nav */}
      <Sidebar user={user} />

      <Header />

      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 900 }}
        style={styles.grid}
      >
        <InfoCard icon={<FaRegClock />} title="Shift Status" value="Inactive" subtext="Not checked in" />
        <InfoCard icon={<FaShieldAlt />} title="Safety Score" value="98%" progress={98} />
        <InfoCard icon={<FaUsers />} title="Team Members" value="12" subtext="8 online, 4 offline" />
        <InfoCard icon={<FaExclamationTriangle />} title="Alerts" value="3" subtext="2 new, 1 pending" alert />
        <WorkInstructions instructions={instructions} />
        <SalaryAttendance data={salaryData} />
        <VideoCommunication />
        <EnvironmentalStatus data={environmentalData} />
      </MotiView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Adjust as needed
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  grid: {
    flexDirection: "column",
    gap: 16,
  },
});

export default Dashboard;
