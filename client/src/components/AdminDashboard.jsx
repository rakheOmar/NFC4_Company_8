import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaChartLine, FaMapMarkedAlt, FaShieldAlt, FaSearch, FaDownload, FaPlus, FaEye, FaCog, FaTimes, FaChartBar, FaCheckCircle, FaShieldVirus, FaMapMarkerAlt } from "react-icons/fa";
import axios from "@/lib/axios"; // Assuming axios is correctly configured for API calls.

// Reusable Shadcn-inspired Info Card component
const AdminInfoCard = ({ title, value, subtext, icon, trend }) => {
  return (
    <div className="flex flex-col rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <div className="rounded-md bg-gray-100 p-2 text-gray-600 dark:bg-slate-800 dark:text-gray-300">
          {React.cloneElement(icon, { className: "h-4 w-4" })}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {value}
        </div>
        {trend && (
          <div className="text-sm text-green-600 dark:text-green-400 mt-2">{trend}</div>
        )}
        {subtext && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{subtext}</div>
        )}
      </div>
    </div>
  );
};

// Reusable Header component
const Header = ({ dashboardType }) => {
  return (
    <div className="space-y-1 mb-6"> {/* Removed motion.div as per example */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardType} Dashboard</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Overview and management tools</p>
    </div>
  );
};

// Helper function to get status badge classes for WorkerManagement
const getStatusClasses = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Offline":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

// WorkerManagement Component
const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  // State for new worker form fields
  const [newWorker, setNewWorker] = useState({
    fullname: "",
    email: "",
    password: "",
    employeeId: "",
    role: "Worker", // Default role to worker
  });

  // Function to fetch workers from the backend
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = {};
      // Pass status to the backend if a filter is selected
      if (statusFilter !== "All Status") {
        params.status = statusFilter;
      }
      // The endpoint is /api/v1/workers as per the provided backend files
      const res = await axios.get("/workers", { params });
      setWorkers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
      // In a real app, show a toast notification for the error
    } finally {
      setLoading(false);
    }
  };

  // Effect to re-fetch workers when statusFilter changes
  useEffect(() => {
    fetchWorkers();
  }, [statusFilter]);

  // Filter workers based on search query using correct field names
  const filteredWorkers = workers.filter((worker) => {
    const name = worker?.name || "";
    const id = worker?.id || ""; // The backend sends 'id'
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle input changes for the new worker form
  const handleNewWorkerChange = (e) => {
    const { name, value } = e.target;
    setNewWorker((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submission of the new worker form
  const handleAddWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        !newWorker.fullname ||
        !newWorker.email ||
        !newWorker.password ||
        !newWorker.employeeId ||
        !newWorker.role
      ) {
        // Using a custom modal/message box instead of alert()
        console.warn("Please fill in all required fields."); // Log to console for now
        // Implement a custom modal for user feedback
        return;
      }
      // This POST request is for a different endpoint, assuming it's correct
      await axios.post("/users/register", newWorker);
      // Using a custom modal/message box instead of alert()
      console.log("Worker added successfully!"); // Log to console for now
      // Implement a custom modal for user feedback
      setShowAddWorkerModal(false);
      setNewWorker({ fullname: "", email: "", password: "", employeeId: "", role: "Worker" });
      fetchWorkers(); // Refresh the worker list
    } catch (err) {
      console.error("Failed to add worker:", err);
      // Using a custom modal/message box instead of alert()
      console.error("Failed to add worker. Please check the console for details."); // Log to console for now
      // Implement a custom modal for user feedback
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md dark:bg-slate-900 dark:text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Worker Management</h2>
        <div className="flex space-x-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
            <FaDownload /> Export
          </button>
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
          >
            <FaPlus /> Add Worker
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-orange-500 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Offline</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading workers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b-2 border-gray-200 dark:border-slate-700">
              <tr>
                {["Worker", "Employee ID", "Role", "Status", "Last Seen", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="pb-4 text-sm font-bold text-gray-500 uppercase tracking-wider px-2 dark:text-gray-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            worker.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name || 'Unnamed')}&background=random`
                          }
                          alt={worker.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">
                            {worker.name || "Unnamed Worker"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-gray-700 dark:text-gray-300">{worker.id || "N/A"}</td>
                    <td className="py-4 px-2 text-gray-700 dark:text-gray-300">{worker.role || "N/A"}</td>
                    <td className="py-4 px-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(worker.status)}`}
                      >
                        {worker.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-700 dark:text-gray-300">{worker.lastSeen || "N/A"}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <FaEye className="cursor-pointer hover:text-orange-500" />
                        <FaCog className="cursor-pointer hover:text-orange-500" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No workers found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Worker Modal */}
      {showAddWorkerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative dark:bg-slate-900 dark:text-gray-200">
            <button
              onClick={() => setShowAddWorkerModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6 dark:text-white">Add New Worker</h3>
            <form onSubmit={handleAddWorkerSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={newWorker.fullname}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newWorker.email}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newWorker.password}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="employeeId"
                  className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={newWorker.employeeId}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={newWorker.role}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600"
              >
                Add Worker
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// MinesDashboard (Placeholder)
// Dummy Data for Mines
const minesData = [
  {
    name: "Central Mine A",
    location: "Jharia, Jharkhand",
    status: "Safe",
    activeWorkers: "24/30",
    production: "1250t",
    capacity: 80,
    envScore: 85,
    lastInspection: "1/15/2024",
  },
  {
    name: "Eastern Mine B",
    location: "Raniganj, West Bengal",
    status: "Warning",
    activeWorkers: "18/25",
    production: "980t",
    capacity: 72,
    envScore: 78,
    lastInspection: "1/14/2024",
  },
  // Removed Western Mine C to show only two cards
];

// Reusable Mine Card Component
const MineCard = ({ mine }) => {
  const statusClasses =
    mine.status === "Safe" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";

  return (
    <div className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-5 dark:bg-slate-900 dark:text-gray-200"> {/* Increased padding and gap */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{mine.name}</h3> {/* Increased font size */}
          <p className="text-base text-gray-500 flex items-center gap-1 dark:text-gray-400"> {/* Increased font size */}
            <FaMapMarkerAlt className="h-5 w-5" /> {mine.location} {/* Increased icon size */}
          </p>
        </div>
        <span className={`px-4 py-2 text-sm font-bold rounded-full ${statusClasses}`}> {/* Increased padding and font size */}
          {mine.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-5 text-center"> {/* Increased gap */}
        <div>
          <p className="text-base text-gray-500 dark:text-gray-400">Active Workers</p> {/* Increased font size */}
          <p className="text-3xl font-bold text-orange-500">{mine.activeWorkers}</p>
        </div>
        <div>
          <p className="text-base text-gray-500 dark:text-gray-400">Production Today</p> {/* Increased font size */}
          <p className="text-3xl font-bold text-orange-500">{mine.production}</p>
        </div>
      </div>

      <div className="space-y-4"> {/* Increased space-y */}
        <div>
          <div className="flex justify-between text-base font-semibold mb-1"> {/* Increased font size */}
            <span className="text-gray-600 dark:text-gray-300">Capacity Utilization</span>
            <span className="text-gray-800 dark:text-white">{mine.capacity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3"> {/* Increased height */}
            <div
              className="bg-orange-500 h-3 rounded-full"
              style={{ width: `${mine.capacity}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-base font-semibold mb-1"> {/* Increased font size */}
            <span className="text-gray-600 dark:text-gray-300">Environmental Score</span>
            <span className="text-gray-800 dark:text-white">{mine.envScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3"> {/* Increased height */}
            <div
              className="bg-orange-500 h-3 rounded-full"
              style={{ width: `${mine.envScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 text-base text-gray-500 dark:border-slate-800 dark:text-gray-400"> {/* Increased padding and font size */}
        Last Inspection: {mine.lastInspection}
      </div>
    </div>
  );
};

const MinesDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Adjusted grid to always show 1 or 2 columns */}
      {minesData.map((mine) => (
        <MineCard key={mine.name} mine={mine} />
      ))}
    </div>
  );
};

// LocationsDashboard (Placeholder)
const LocationsDashboard = () => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Locations Dashboard</h2>
    <p className="text-gray-700 dark:text-gray-300">
      Manage and visualize all operational locations.
    </p>
  </div>
);

// ProductionAnalytics Sub-component for AnalyticsDashboard
const ProductionAnalytics = () => (
  <div className="bg-white p-6 rounded-xl shadow-md dark:bg-slate-900 dark:text-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4 dark:text-white">
      <FaChartBar className="text-gray-400" />
      Production Analytics
    </h3>
    <div className="flex justify-around items-center text-center">
      <div>
        <p className="text-3xl font-bold text-orange-500">3.75k</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Today's Production (tons)</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-green-600">+12%</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">vs Yesterday</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-orange-500">94%</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Target Achievement</p>
      </div>
    </div>
  </div>
);

// SafetyMetrics Sub-component for AnalyticsDashboard
const SafetyMetrics = () => (
  <div className="bg-white p-6 rounded-xl shadow-md dark:bg-slate-900 dark:text-gray-200">
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4 dark:text-white">
      <FaShieldAlt className="text-gray-400" />
      Safety Metrics
    </h3>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-50 p-4 rounded-lg text-center dark:bg-slate-800">
        <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800 dark:text-white">0</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Incidents Today</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center dark:bg-slate-800">
        <FaShieldVirus className="text-orange-500 text-2xl mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800 dark:text-white">256</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Days Accident-Free</p>
      </div>
    </div>
    <div>
      <div className="flex justify-between text-sm font-semibold mb-1">
        <span className="text-gray-600 dark:text-gray-300">Safety Compliance</span>
        <span className="text-gray-800 dark:text-white">96%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-slate-700">
        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "96%" }}></div>
      </div>
    </div>
  </div>
);

// AnalyticsDashboard Component
const AnalyticsDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProductionAnalytics />
      <SafetyMetrics />
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
    totalMachines: 0, // Added based on typical dashboard metrics
    machinesUnderMaintenance: 0, // Added based on typical dashboard metrics
    machinesOffline: 0,
    maintenancePercentage: 0,
  });

  // Function to fetch dashboard overview data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // The endpoint is /admin/overview as per the provided backend route
      const res = await axios.get("/admin/overview");
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
      // In a real app, you might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 sec
    return () => clearInterval(interval);
  }, []);

  // Renders the content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "Workers":
        return <WorkerManagement />;
      case "Mines":
        return <MinesDashboard />;
      // Removed Locations tab content
      case "Analytics":
        return <AnalyticsDashboard />;
      default:
        return <WorkerManagement />;
    }
  };

  const tabs = ["Workers", "Mines", "Analytics"]; // Removed "Locations" from tabs array

  // Framer Motion variants for the info card animations
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Framer Motion variants for the tab content animation
  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-inter">
      {/* The main content wrapper now has max-width and horizontal padding */}
      <div className="max-w-screen-xl mx-auto px-[10%] py-8"> {/* Adjusted to px-[10%] */}
        <Header dashboardType="Admin" />

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            <div className="col-span-4 text-center py-4 text-gray-500 dark:text-gray-400">Loading dashboard data...</div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <AdminInfoCard
                  title="Total Admins"
                  value={dashboardData.totalAdmins}
                  trend="+1 from last week"
                  icon={<FaUsers />}
                />
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <AdminInfoCard
                  title="Total Supervisors"
                  value={dashboardData.totalSupervisors}
                  subtext="Managing all operations"
                  icon={<FaChartLine />}
                />
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <AdminInfoCard
                  title="Total Workers"
                  value={dashboardData.totalWorkers}
                  subtext="All workforce"
                  icon={<FaUsers />}
                />
              </motion.div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={itemVariants}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <AdminInfoCard
                  title="Machines Offline"
                  value={dashboardData.machinesOffline}
                  subtext={`Maintenance: ${dashboardData.maintenancePercentage}%`}
                  icon={<FaShieldAlt />}
                />
              </motion.div>
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <nav className="border-b border-gray-200 dark:border-slate-800">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 px-5 text-sm font-medium transition-all duration-200 focus:outline-none 
                  ${activeTab === tab
                    ? "text-orange-500" // Changed to orange-500
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab}
                {/* Active tab indicator with animation */}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline" // Ensures smooth animation between tabs
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" // Changed to orange-500
                    initial={false} // Prevents initial animation on mount
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </nav>

        {/* Main Content Area with AnimatePresence for tab transitions */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8"
        >
          <AnimatePresence mode="wait"> {/* 'wait' mode ensures exit animation completes before new component mounts */}
            <motion.div
              key={activeTab} // Key changes when activeTab changes, triggering animations
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminDashboard;
