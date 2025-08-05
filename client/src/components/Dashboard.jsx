import React from "react";
import Header from "./Header.jsx";
import "../App.css";
import InfoCard from "./InfoCard.jsx";
import WorkInstructions from "./WorkInstructions.jsx";
import SalaryAttendance from "./SalaryAttendance.jsx";
import VideoCommunication from "@/components/VideoComponent.jsx";
import EnvironmentalStatus from "./EnvironmentalStatus.jsx";
import Sidebar from "./Sidebar.jsx";
// Import Icons
import { FaRegClock, FaShieldAlt, FaUsers, FaExclamationTriangle } from "react-icons/fa";

const Dashboard = () => {
  // Dummy data - In a real app, this would come from your server API
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
    <div className="dashboard-container">
      <Sidebar user={user} />
      <div className="main-content">
        <Header />
        <div className="dashboard-grid">
          <InfoCard
            icon={<FaRegClock />}
            title="Shift Status"
            value="Inactive"
            subtext="Not checked in"
          />
          <InfoCard icon={<FaShieldAlt />} title="Safety Score" value="98%" progress={98} />
          <InfoCard
            icon={<FaUsers />}
            title="Team Members"
            value="12"
            subtext="8 online, 4 offline"
          />
          <InfoCard
            icon={<FaExclamationTriangle />}
            title="Alerts"
            value="3"
            subtext="2 new, 1 pending"
            alert={true}
          />
          <WorkInstructions instructions={instructions} />
          <SalaryAttendance data={salaryData} />
          <VideoCommunication />
          <EnvironmentalStatus data={environmentalData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
