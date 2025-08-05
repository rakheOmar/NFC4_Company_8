import React, { useState, useEffect } from "react";
import AdminInfoCard from "./AdminInfo";
import WorkerManagement from "./WorkerManagement";
import MinesDashboard from "./MinesDashboard";
import LocationsDashboard from "./LocationsDashboard";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { FaUsers, FaChartLine, FaMapMarkedAlt, FaShieldAlt } from "react-icons/fa";
import axios from "@/lib/axios";

const Header = ({ dashboardType }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800">{dashboardType} Dashboard</h1>
      <p className="text-gray-500">Overview and management tools</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Workers");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalAdmins: 0,
    totalSupervisors: 0,
    totalWorkers: 0,
    totalMachines: 0,
    machinesUnderMaintenance: 0,
    machinesOffline: 0,
    maintenancePercentage: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/overview"); // ✅ Matches your backend route
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

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
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        <Header dashboardType="Admin" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
          {loading ? (
            <div className="col-span-4 text-center py-4">Loading dashboard data...</div>
          ) : (
            <>
              <AdminInfoCard
                title="Total Admins"
                value={dashboardData.totalAdmins}
                trend="+1 from last week"
                icon={<FaUsers />}
              />
              <AdminInfoCard
                title="Total Supervisors"
                value={dashboardData.totalSupervisors}
                subtext="Managing all operations"
                icon={<FaChartLine />}
              />
              <AdminInfoCard
                title="Total Workers"
                value={dashboardData.totalWorkers}
                subtext="All workforce"
                icon={<FaUsers />}
              />
              <AdminInfoCard
                title="Machines Offline"
                value={dashboardData.machinesOffline}
                subtext={`Maintenance: ${dashboardData.maintenancePercentage}%`}
                icon={<FaShieldAlt />}
              />
            </>
          )}
        </div>

        <nav className="border-b border-gray-200">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 font-semibold transition-colors duration-200 text-base ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        <main className="mt-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
