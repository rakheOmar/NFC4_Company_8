import React, { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertCircle, FileTerminal, ShieldAlert, Save, Bot, Users, Battery } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Leaflet marker fix for bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Exponential backoff for API calls
const callApiWithBackoff = async (apiCall, maxRetries = 5, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      return response;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (error.response && (error.response.status === 429 || error.response.status >= 500)) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        } else {
          throw error; // Re-throw if max retries reached
        }
      } else {
        throw error; // Re-throw for other types of errors
      }
    }
  }
};

// --- Static Data Fallbacks (Defined once, more concise for a single worker) ---
const staticWorker = {
  _id: "worker_offline_1",
  fullname: "Static Worker",
  role: "Miner",
  currentLocation: { coordinates: [23.74, 86.42], type: "Point" },
  status: "Active",
  ppeStatus: { helmet: true, vest: true, mask: true },
  fatigue: 20,
  lastUpdate: new Date().toISOString(),
  assignedEquipment: [
    {
      _id: "machine_offline_1",
      name: "Static Excavator",
      type: "Excavator",
      fuelType: "Diesel",
      consumptionRate: 15,
      runtimeHours: 1200,
      status: "Operational",
      fuelLevel: 80,
      currentLocation: { coordinates: [23.738, 86.418], type: "Point" },
      lastUpdate: new Date().toISOString(),
    },
  ],
};
const staticAlerts = [
  {
    _id: "alert_offline_1",
    message: "STATIC: High gas level detected in your zone!",
    type: "safety",
    timestamp: new Date().toISOString(),
    resolved: false,
  },
];
const staticIncidents = [
  {
    _id: "incident_offline_1",
    site: "60d0fe4f5311236168a10000", // Example static site ID
    type: "NEAR_MISS",
    severity: "Medium",
    status: "Reported",
    description: "STATIC: Near miss with falling debris.",
    location: { type: "Point", coordinates: [23.74, 86.42] },
    reportedBy: "mock_user_12345",
    involvedUsers: [],
    involvedEquipment: null,
    mediaUrls: [],
    resolutionNotes: "",
    timestamp: new Date().toISOString(),
  },
];
const staticProjects = [
  {
    _id: "project_offline_1",
    name: "Static Project Alpha",
    budget: 150000,
    timeline: "Q1-Q2 2025",
    status: "In Progress",
    outcomes: "Improved ventilation system design",
    createdAt: new Date().toISOString(),
  },
];
const staticCarbonData = {
  _id: "carbon_offline_1",
  fuelConsumption: 50,
  materialLogistics: 10,
  estimatedEmissions: 50 * 2.3 + 10 * 0.5,
  lastUpdate: new Date().toISOString(),
};
const staticCarbonAlternatives = ["STATIC: Implement energy-efficient practices."];

// --- Local Storage Key for Pending Writes ---
const PENDING_WRITES_KEY = "pending_worker_writes";

function WorkerDashboard({ userId }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  // State for data, now focused on a single worker
  const [worker, setWorker] = useState(staticWorker);
  const [machines, setMachines] = useState(staticWorker.assignedEquipment);
  const [alerts, setAlerts] = useState(staticAlerts);
  const [incidents, setIncidents] = useState(staticIncidents);
  const [projects, setProjects] = useState(staticProjects); // Projects are still here for carbon tab if needed

  // States for forms - Incident Report updated to match new schema
  const [incidentReport, setIncidentReport] = useState({
    site: "",
    type: "",
    severity: "Medium", // Default severity
    status: "Reported", // Default status
    description: "",
    location: { type: "Point", coordinates: [] }, // GeoJSON Point structure
    involvedUsers: [], // Array of user IDs (strings for now)
    involvedEquipment: "", // Single equipment ID (string for now)
    mediaUrls: [], // Array of URLs (strings)
  });

  // --- Data Fetching Logic (Polling) ---
  const fetchData = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const workerResponse = await callApiWithBackoff(() => axios.get(`/api/v1/users/${userId}`));
      const fetchedWorkerData = workerResponse.data.data;
      if (fetchedWorkerData) {
        setWorker(fetchedWorkerData);
        setMachines(fetchedWorkerData.assignedEquipment || []);
      } else {
        throw new Error("Worker data not found.");
      }

      const alertsResponse = await callApiWithBackoff(() =>
        axios.get(`/api/v1/alerts/user/${userId}`)
      );
      setAlerts(alertsResponse.data.data || staticAlerts);

      // Fetch incidents for the logged-in user
      const incidentsResponse = await callApiWithBackoff(() =>
        axios.get(`/api/v1/incidents/user/${userId}`)
      );
      setIncidents(incidentsResponse.data.data || staticIncidents);

      setProjects(staticProjects); // Projects are still here for carbon tab if needed

      setError(null);
    } catch (err) {
      console.error("Failed to fetch live data, using static fallbacks:", err);
      setError("Could not fetch live data. Displaying static data for a generic worker.");
      setWorker(staticWorker);
      setMachines(staticWorker.assignedEquipment);
      setAlerts(staticAlerts);
      setIncidents(staticIncidents);
      setProjects(staticProjects);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // --- Offline Write Queue Management ---
  const processPendingWrites = useCallback(async () => {
    if (!onlineStatus) return;

    let pendingWrites = JSON.parse(localStorage.getItem(PENDING_WRITES_KEY) || "[]");
    if (pendingWrites.length === 0) return;

    console.log(`Attempting to process ${pendingWrites.length} pending writes...`);

    const successfulWriteIds = new Set();
    for (const write of pendingWrites) {
      try {
        const response = await callApiWithBackoff(() =>
          axios({
            method: write.method,
            url: write.url,
            data: write.body,
            withCredentials: true,
          })
        );
        if (response.status >= 200 && response.status < 300) {
          console.log(`Successfully synced: ${write.url}`);
          successfulWriteIds.add(write.id);
        } else {
          console.warn(
            `Failed to sync ${write.url} (status: ${response.status}). Keeping in queue.`
          );
        }
      } catch (err) {
        console.error(`Error during sync for ${write.url}:`, err);
      }
    }

    const remainingWrites = pendingWrites.filter((pw) => !successfulWriteIds.has(pw.id));
    localStorage.setItem(PENDING_WRITES_KEY, JSON.stringify(remainingWrites));

    if (remainingWrites.length === 0) {
      console.log("All pending writes processed.");
    } else {
      console.log(`${remainingWrites.length} writes remaining in queue.`);
    }

    fetchData();
  }, [onlineStatus, fetchData]);

  // --- Initial Load, Polling, and Offline Sync Setup ---
  useEffect(() => {
    fetchData();

    const pollingInterval = setInterval(fetchData, 10000);

    const handleOnlineStatusChange = () => {
      setOnlineStatus(navigator.onLine);
      if (navigator.onLine) {
        processPendingWrites();
      }
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      clearInterval(pollingInterval);
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, [fetchData, processPendingWrites]);

  // --- Helper to Queue Writes ---
  const queueWrite = (url, method, body) => {
    let pendingWrites = JSON.parse(localStorage.getItem(PENDING_WRITES_KEY) || "[]");
    pendingWrites.push({ id: Date.now() + Math.random(), url, method, body });
    localStorage.setItem(PENDING_WRITES_KEY, JSON.stringify(pendingWrites));
    console.log("Operation queued for offline sync.");
  };

  // Custom message box function
  const showMessageBox = (message) => {
    toast(message, {
      description: onlineStatus ? "Synced with server." : "Saved locally, will sync when online.",
      position: "bottom-center",
    });
  };

  // --- Data Operation Functions (Add/Update) ---
  const handleIncidentChange = (e) => {
    const { name, value } = e.target;
    if (name === "coordinates") {
      // Assuming coordinates are entered as "lat,lon" string
      const coords = value.split(",").map(Number);
      setIncidentReport((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1]) ? coords : [],
        },
      }));
    } else if (name === "involvedUsers" || name === "mediaUrls") {
      // For comma-separated string inputs for arrays
      setIncidentReport((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      }));
    } else {
      setIncidentReport((prev) => ({ ...prev, [name]: value }));
    }
  };

  const submitIncident = async () => {
    if (
      !userId ||
      !incidentReport.site ||
      !incidentReport.type ||
      !incidentReport.description ||
      incidentReport.location.coordinates.length !== 2
    ) {
      toast.error(
        "Please fill out all required fields: Site, Type, Description, and Location (Latitude, Longitude)."
      );
      return;
    }

    const incidentData = {
      ...incidentReport,
      reportedBy: userId,
      timestamp: new Date().toISOString(),
      status: incidentReport.status || "Reported", // Ensure default if not set
      severity: incidentReport.severity || "Medium", // Ensure default if not set
      location: {
        type: "Point",
        coordinates: incidentReport.location.coordinates, // Ensure coordinates are numbers
      },
      // Ensure involvedUsers and mediaUrls are arrays, even if empty
      involvedUsers: incidentReport.involvedUsers || [],
      involvedEquipment: incidentReport.involvedEquipment || null,
      mediaUrls: incidentReport.mediaUrls || [],
    };

    if (!onlineStatus) {
      queueWrite(`/api/v1/incidents`, "POST", incidentData);
      setIncidents((prev) => [...prev, { _id: `temp_${Date.now()}`, ...incidentData }]);
      setIncidentReport({
        // Reset form
        site: "",
        type: "",
        severity: "Medium",
        status: "Reported",
        description: "",
        location: { type: "Point", coordinates: [] },
        involvedUsers: [],
        involvedEquipment: "",
        mediaUrls: [],
      });
      showMessageBox("Incident queued for offline sync!");
      return;
    }

    try {
      const response = await callApiWithBackoff(() =>
        axios.post(`/api/v1/incidents`, incidentData)
      );
      if (response.status >= 200 && response.status < 300) {
        setIncidentReport({
          // Reset form
          site: "",
          type: "",
          severity: "Medium",
          status: "Reported",
          description: "",
          location: { type: "Point", coordinates: [] },
          involvedUsers: [],
          involvedEquipment: "",
          mediaUrls: [],
        });
        showMessageBox("Incident Reported Successfully!");
        fetchData();
      } else {
        toast.error(response.data?.message || "Failed to report incident online.");
      }
    } catch (e) {
      console.error("Error reporting incident online:", e);
      toast.error(
        e.response?.data?.message || "Failed to report incident. Check network or backend."
      );
    }
  };

  const updateMachineStatus = async (machineIdToUpdate, newStatus) => {
    // Log to check if the function is called and with what parameters
    console.log("updateMachineStatus called with:", { machineIdToUpdate, newStatus });

    // Determine the new status, specifically for the 'Toggle Status' button
    const toggledStatus = newStatus === "Operational" ? "Maintenance" : "Operational";
    const updateData = { status: toggledStatus, lastUpdate: new Date().toISOString() };
    const url = `/api/v1/equipment/${machineIdToUpdate}`;

    console.log(
      "updateMachineStatus: Attempting to update machine status for URL:",
      url,
      "with data:",
      updateData
    );

    // Immediately update local state to reflect the change on the frontend
    setMachines((prev) =>
      prev.map((m) => (m._id === machineIdToUpdate ? { ...m, ...updateData } : m))
    );

    if (!onlineStatus) {
      // If offline, queue the write and show a toast message
      console.log("updateMachineStatus: Offline, queuing write.");
      queueWrite(url, "PATCH", updateData);
      showMessageBox(
        `Machine status set to '${toggledStatus}'! It will sync when a connection is available.`
      );
    } else {
      // If online, try to make the API call immediately
      try {
        console.log("updateMachineStatus: Online, attempting immediate API call.");
        const response = await callApiWithBackoff(() => axios.patch(url, updateData));
        console.log("updateMachineStatus: API response received:", response);
        if (response.status >= 200 && response.status < 300) {
          showMessageBox("Machine Status Updated!");
          // The polling interval will also catch the update, but we've already
          // optimistically updated the UI, so no need for an extra fetch.
          // fetchData();
        } else {
          console.error(
            "updateMachineStatus: API call failed with status:",
            response.status,
            response.data
          );
          toast.error(response.data?.message || "Failed to update machine status online.");
          // Revert local state if the API call fails
          setMachines((prev) =>
            prev.map((m) => (m._id === machineIdToUpdate ? { ...m, status: newStatus } : m))
          );
        }
      } catch (e) {
        console.error("updateMachineStatus: Error during API call:", e);
        toast.error(
          e.response?.data?.message || "Failed to update machine status. Check network or backend."
        );
        // Revert local state on error
        setMachines((prev) =>
          prev.map((m) => (m._id === machineIdToUpdate ? { ...m, status: newStatus } : m))
        );
      }
    }
  };

  // New function to update incident status
  const updateIncidentStatus = async (incidentIdToUpdate, newStatus) => {
    if (!userId) return;

    const updateData = { status: newStatus, resolutionNotes: `Marked as ${newStatus} by worker.` };
    const url = `/api/v1/incidents/${incidentIdToUpdate}`;

    if (!onlineStatus) {
      queueWrite(url, "PATCH", updateData);
      setIncidents((prev) =>
        prev.map((inc) => (inc._id === incidentIdToUpdate ? { ...inc, ...updateData } : inc))
      );
      showMessageBox(`Incident status queued for offline sync: ${newStatus}!`);
      return;
    }

    try {
      const response = await callApiWithBackoff(() => axios.patch(url, updateData));
      if (response.status >= 200 && response.status < 300) {
        showMessageBox(`Incident Status Updated to ${newStatus}!`);
        fetchData(); // Refresh data after successful write
      } else {
        toast.error(
          response.data?.message || `Failed to update incident status to ${newStatus} online.`
        );
      }
    } catch (e) {
      console.error(`Error updating incident status to ${newStatus} online:`, e);
      toast.error(
        e.response?.data?.message || `Failed to update incident status. Check network or backend.`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-semibold">Loading Worker Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-900 text-white">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter flex flex-col">
      <Toaster richColors position="bottom-center" />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          /* Custom scrollbar for better aesthetics */
          ::-webkit-scrollbar {
              width: 8px;
          }
          ::-webkit-scrollbar-track {
              background: #2d3748;
              border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
              background: #4a5568;
              border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
          }
          `}
      </style>
      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center rounded-b-lg">
        <h1 className="text-2xl font-bold text-blue-400">Worker Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${onlineStatus ? "bg-green-500" : "bg-red-500"} text-white`}
          >
            {onlineStatus ? "Online" : "Offline"}
          </span>
          <nav>
            <ul className="flex space-x-4">
              {["dashboard", "my-equipment", "safety", "carbon"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {tab
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="text-sm text-gray-400 mb-4">
          Logged in as:{" "}
          <span className="font-semibold text-blue-300 break-all">
            {worker.fullname || "Loading..."} ({userId})
          </span>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">My Status</h2>
              <div className="space-y-3">
                <p className="font-medium text-gray-200">
                  Role: <span className="font-normal text-gray-300">{worker.role || "N/A"}</span>
                </p>
                <p className="font-medium text-gray-200">
                  Location:{" "}
                  <span className="font-normal text-gray-300">
                    {worker.currentLocation?.coordinates?.join(", ") || "N/A"}
                  </span>
                </p>
                <p className="font-medium text-gray-200">
                  Status:{" "}
                  <span
                    className={`font-bold ${worker.status === "Active" ? "text-green-400" : "text-yellow-400"}`}
                  >
                    {worker.status || "N/A"}
                  </span>
                </p>
                <p className="font-medium text-gray-200">
                  Fatigue Level:{" "}
                  <span className="font-normal text-gray-300">{worker.fatigue || "N/A"}%</span>
                </p>
                <p className="font-medium text-gray-200">
                  PPE Status:{" "}
                  <span className="font-normal text-gray-300">
                    {worker.ppeStatus?.helmet ? "Helmet On" : "Helmet Off"},{" "}
                    {worker.ppeStatus?.vest ? "Vest On" : "Vest Off"}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Last Updated:{" "}
                  {worker.lastUpdate ? new Date(worker.lastUpdate).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">My Assigned Equipment</h2>
              {machines.length > 0 ? (
                <ul>
                  {machines.map((machine) => (
                    <li
                      key={machine._id}
                      className="mb-2 p-3 bg-gray-700 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-200">{machine.name}</p>
                        <p className="text-sm text-gray-400">
                          Status:{" "}
                          <span
                            className={`font-semibold ${machine.status === "Operational" ? "text-green-400" : "text-red-400"}`}
                          >
                            {machine.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">Fuel Level: {machine.fuelLevel}%</p>
                      </div>
                      <button
                        onClick={() =>
                          updateMachineStatus(
                            machine._id,
                            machine.status === "Operational" ? "Maintenance" : "Operational"
                          )
                        }
                        className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Toggle Status
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No equipment currently assigned.</p>
              )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">My Alerts</h2>
              {alerts.length > 0 ? (
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {alerts.map((alert) => (
                    <li
                      key={alert._id}
                      className={`p-3 rounded-md ${alert.resolved ? "bg-green-700" : "bg-red-700"}`}
                    >
                      <p className="font-medium text-white">{alert.message}</p>
                      <p className="text-sm text-gray-200 mt-1">
                        <span className="font-semibold">Type:</span> {alert.type}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No new alerts at the moment. All clear!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-equipment" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">My Assigned Equipment</h2>
            {machines.length > 0 ? (
              <ul>
                {machines.map((machine) => (
                  <li
                    key={machine._id}
                    className="mb-2 p-3 bg-gray-700 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-200">{machine.name}</p>
                      <p className="text-sm text-gray-400">
                        Status:{" "}
                        <span
                          className={`font-semibold ${machine.status === "Operational" ? "text-green-400" : "text-red-400"}`}
                        >
                          {machine.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-400">Fuel Level: {machine.fuelLevel}%</p>
                    </div>
                    <button
                      onClick={() =>
                        updateMachineStatus(
                          machine._id,
                          machine.status === "Operational" ? "Maintenance" : "Operational"
                        )
                      }
                      className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Toggle Status
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No equipment currently assigned.</p>
            )}
          </div>
        )}

        {activeTab === "safety" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Report an Incident</h2>
            <div className="mb-6 p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-medium mb-3 text-gray-200">Submit a New Report</h3>
              <div className="space-y-4">
                {/* Site ID */}
                <input
                  type="text"
                  name="site"
                  placeholder="Site ID (e.g., 60d0fe4f5311236168a10000)"
                  value={incidentReport.site}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {/* Incident Type */}
                <select
                  name="type"
                  value={incidentReport.type}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Incident Type</option>
                  <option value="PPE_VIOLATION">PPE Violation</option>
                  <option value="DANGER_ZONE_ENTRY">Danger Zone Entry</option>
                  <option value="EQUIPMENT_MALFUNCTION">Equipment Malfunction</option>
                  <option value="HAZARD_REPORT">Hazard Report</option>
                  <option value="NEAR_MISS">Near Miss</option>
                  <option value="ENVIRONMENTAL_SPILL">Environmental Spill</option>
                  <option value="OTHER">Other</option>
                </select>
                {/* Severity */}
                <select
                  name="severity"
                  value={incidentReport.severity}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
                {/* Location (Coordinates) */}
                <input
                  type="text"
                  name="coordinates"
                  placeholder="Location (Lat,Lon e.g., 23.74,86.42)"
                  value={incidentReport.location.coordinates.join(",")}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {/* Description */}
                <textarea
                  name="description"
                  placeholder="Detailed Description of Incident"
                  value={incidentReport.description}
                  onChange={handleIncidentChange}
                  rows="4"
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
                {/* Involved Users (Optional) */}
                <input
                  type="text"
                  name="involvedUsers"
                  placeholder="Involved User IDs (comma-separated, optional)"
                  value={incidentReport.involvedUsers.join(",")}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Involved Equipment (Optional) */}
                <input
                  type="text"
                  name="involvedEquipment"
                  placeholder="Involved Equipment ID (optional)"
                  value={incidentReport.involvedEquipment}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Media URLs (Optional) */}
                <input
                  type="text"
                  name="mediaUrls"
                  placeholder="Media URLs (comma-separated, optional)"
                  value={incidentReport.mediaUrls.join(",")}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={submitIncident}
                className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                Submit Report
              </button>
            </div>

            <h3 className="text-lg font-medium mb-3 text-gray-200">My Recent Reports</h3>
            {incidents.length > 0 ? (
              <ul className="space-y-3">
                {incidents.map((incident) => (
                  <li
                    key={incident._id}
                    className="p-3 bg-gray-700 rounded-md shadow-sm border border-gray-600 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-200">
                        {incident.type} - {incident.location?.coordinates?.join(", ") || "N/A"}
                      </p>
                      <p className="text-sm text-gray-300">{incident.description}</p>
                      <p className="text-sm text-gray-300">
                        Severity: <span className="font-semibold">{incident.severity}</span> |
                        Status:{" "}
                        <span
                          className={`font-semibold ${incident.status === "Resolved" ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {incident.status}
                        </span>
                      </p>
                      {incident.involvedUsers && incident.involvedUsers.length > 0 && (
                        <p className="text-sm text-gray-300">
                          Involved Users: {incident.involvedUsers.join(", ")}
                        </p>
                      )}
                      {incident.involvedEquipment && (
                        <p className="text-sm text-gray-300">
                          Involved Equipment: {incident.involvedEquipment}
                        </p>
                      )}
                      {incident.mediaUrls && incident.mediaUrls.length > 0 && (
                        <p className="text-sm text-gray-300">
                          Media: {incident.mediaUrls.length} files
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Reported:{" "}
                        {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : "N/A"}
                      </p>
                    </div>
                    {incident.status !== "Resolved" && (
                      <button
                        onClick={() => updateIncidentStatus(incident._id, "Resolved")}
                        className="ml-4 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No incidents reported recently.</p>
            )}
          </div>
        )}

        {activeTab === "carbon" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Carbon Footprint</h2>
            <p className="mb-4 text-gray-400">View-only access to company-wide carbon metrics.</p>
            <div className="p-4 bg-gray-700 rounded-md">
              <p className="text-gray-300 mb-2">
                Fuel Consumption:{" "}
                <span className="font-semibold">
                  {staticCarbonData.fuelConsumption.toFixed(2)} Liters
                </span>
              </p>
              <p className="text-gray-300 mb-2">
                Material Logistics:{" "}
                <span className="font-semibold">
                  {staticCarbonData.materialLogistics.toFixed(2)} Tons
                </span>
              </p>
              <p className="text-xl text-white font-bold mt-4">
                Estimated CO2 Emissions:{" "}
                <span className="text-green-400">
                  {staticCarbonData.estimatedEmissions.toFixed(2)} kg CO2
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (Data displayed is static for this worker view)
              </p>
            </div>
            <h3 className="text-lg font-medium mt-6 mb-3 text-gray-200">
              Carbon Neutrality Suggestions
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {staticCarbonAlternatives.map((alt, index) => (
                <li key={index}>{alt}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkerDashboard;
