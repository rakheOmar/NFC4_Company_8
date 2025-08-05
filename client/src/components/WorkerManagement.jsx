import React, { useEffect, useState } from "react";
import { FaSearch, FaDownload, FaPlus, FaEye, FaCog, FaTimes } from "react-icons/fa";
import axios from "@/lib/axios"; // Assuming axios is configured for your API endpoint

const getStatusClasses = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-500 text-white"; // Tailwind green for active
    case "Offline":
      return "bg-gray-400 text-white";
    case "On Break":
      return "bg-yellow-400 text-yellow-900"; // Tailwind yellow for on break
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const WorkerManagement = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  // State for new worker form fields, updated to new requirements
  const [newWorker, setNewWorker] = useState({
    fullname: "",
    email: "",
    password: "",
    employeeId: "",
    role: "",
  });

  // Function to fetch workers from the backend
  const fetchWorkers = async () => {
    try {
      setLoading(true);

      const params = {};
      if (statusFilter !== "All Status") {
        params.status = statusFilter;
      }

      // Updated GET request to include the API prefix
      const res = await axios.get("/workers", { params });
      setWorkers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
      // Optionally show a toast or message to the user
    } finally {
      setLoading(false);
    }
  };

  // Effect to re-fetch workers when statusFilter changes
  useEffect(() => {
    fetchWorkers();
  }, [statusFilter]);

  // Filter workers based on search query (updated to use fullname and employeeId)
  const filteredWorkers = workers.filter((worker) => {
    const fullname = worker?.fullname || "";
    const employeeId = worker?.employeeId || "";
    return (
      fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employeeId.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Basic validation, updated for new fields
      if (
        !newWorker.fullname ||
        !newWorker.email ||
        !newWorker.password ||
        !newWorker.employeeId ||
        !newWorker.role
      ) {
        alert(
          "Please fill in all required fields: Full Name, Email, Password, Employee ID, and Role."
        );
        return;
      }

      // Add lastSeen field with current timestamp (assuming backend still uses this)
      const workerDataToSubmit = {
        ...newWorker,
        lastSeen: new Date().toISOString(), // ISO string for consistent date handling
      };

      // Corrected POST request to use the /api/v1/workers endpoint
      await axios.post("/users/register ", workerDataToSubmit);
      alert("Worker added successfully!"); // Replace with a proper toast/modal in a real app
      setShowAddWorkerModal(false); // Close the modal
      setNewWorker({
        // Reset form fields to initial empty state
        fullname: "",
        email: "",
        password: "",
        employeeId: "",
        role: "",
      });
      fetchWorkers(); // Refresh the worker list
    } catch (err) {
      console.error("Failed to add worker:", err);
      alert("Failed to add worker. Please try again."); // Replace with a proper toast/modal
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
            placeholder="Search workers by name or ID..." // Updated placeholder
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Offline</option>
          <option>On Break</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading workers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b-2 border-gray-200">
              <tr>
                {/* Updated table headers */}
                {["Full Name", "Email", "Employee ID", "Role", "Last Seen", "Actions"].map((h) => (
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
                  <tr key={worker.employeeId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={worker.avatar || "https://placehold.co/40x40/cccccc/333333?text=U"} // Placeholder for avatar
                          alt={worker.fullname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">
                            {worker.fullname || "Unnamed Worker"}
                          </div>
                          <div className="text-sm text-gray-500">{worker.employeeId || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-gray-700">{worker.email || "N/A"}</td>
                    <td className="py-4 px-2 text-gray-700">{worker.employeeId || "N/A"}</td>
                    <td className="py-4 px-2 text-gray-700">{worker.role || "N/A"}</td>
                    <td className="py-4 px-2 text-gray-700">
                      {worker.lastSeen ? new Date(worker.lastSeen).toLocaleString() : "N/A"}
                    </td>
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
                    {" "}
                    {/* Updated colspan */}
                    No workers found
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {/* Removed PPE Status, Status, and Avatar URL fields */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
