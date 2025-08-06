import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaPlus, FaEye, FaCog, FaTimes } from "react-icons/fa";
import axios from "@/lib/axios"; // Assuming axios is configured for your API endpoint

// Helper function to get status badge classes
const getStatusClasses = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Offline":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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

  // --- FIXED: Function to fetch workers from the backend ---
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

  // --- FIXED: Filter workers based on search query using correct field names ---
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
        alert("Please fill in all required fields.");
        return;
      }
      // This POST request is for a different endpoint, assuming it's correct
      await axios.post("/users/register", newWorker);
      alert("Worker added successfully!");
      setShowAddWorkerModal(false);
      setNewWorker({ fullname: "", email: "", password: "", employeeId: "", role: "Worker" });
      fetchWorkers(); // Refresh the worker list
    } catch (err) {
      console.error("Failed to add worker:", err);
      alert("Failed to add worker. Please check the console for details.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Worker Management</h2>
        <div className="flex space-x-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
            <FaDownload /> Export
          </button>
          <button
            onClick={() => setShowAddWorkerModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        {/* --- FIXED: Removed "On Break" as it's not supported by the backend --- */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Offline</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4 text-gray-600">Loading workers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                {/* --- FIXED: Updated table headers to reflect API data --- */}
                {["Worker", "Employee ID", "Role", "Status", "Last Seen", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="pb-4 text-sm font-bold text-gray-500 uppercase tracking-wider px-2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            worker.avatar ||
                            `https://ui-avatars.com/api/?name=${worker.name}&background=random`
                          }
                          alt={worker.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          {/* --- FIXED: Use `worker.name` --- */}
                          <div className="font-semibold text-gray-800">
                            {worker.name || "Unnamed Worker"}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* --- FIXED: Use `worker.id` for Employee ID --- */}
                    <td className="py-4 px-2 text-gray-700">{worker.id || "N/A"}</td>
                    <td className="py-4 px-2 text-gray-700">{worker.role || "N/A"}</td>
                    <td className="py-4 px-2">
                      {/* --- FIXED: Added a status badge --- */}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(worker.status)}`}
                      >
                        {worker.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-700">{worker.lastSeen || "N/A"}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-4 text-gray-500">
                        <FaEye className="cursor-pointer hover:text-blue-600" />
                        <FaCog className="cursor-pointer hover:text-blue-600" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowAddWorkerModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add New Worker</h3>
            <form onSubmit={handleAddWorkerSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={newWorker.fullname}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newWorker.email}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newWorker.password}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="employeeId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Employee ID
                </label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={newWorker.employeeId}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={newWorker.role}
                  onChange={handleNewWorkerChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
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

export default WorkerManagement;