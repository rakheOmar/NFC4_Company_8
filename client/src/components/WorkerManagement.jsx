import React from "react";
import { FaSearch, FaDownload, FaPlus, FaEye, FaCog } from "react-icons/fa";

const workersData = [
  {
    id: "MIN-2024-001",
    name: "John Doe",
    role: "Mining Operator",
    shift: "Day Shift",
    location: "Tunnel B-7",
    status: "Active",
    safetyScore: 98,
    lastSeen: "2 min ago",
  },
  {
    id: "MIN-2024-002",
    name: "Sarah Wilson",
    role: "Safety Inspector",
    shift: "Day Shift",
    location: "Main Hub",
    status: "Active",
    safetyScore: 100,
    lastSeen: "1 min ago",
  },
  {
    id: "MIN-2024-003",
    name: "Mike Johnson",
    role: "Equipment Operator",
    shift: "Night Shift",
    location: "Tunnel A-3",
    status: "On Break",
    safetyScore: 95,
    lastSeen: "15 min ago",
  },
  {
    id: "MIN-2024-004",
    name: "Alex Chen",
    role: "Mining Engineer",
    shift: "Day Shift",
    location: "Control Room",
    status: "Active",
    safetyScore: 97,
    lastSeen: "5 min ago",
  },
];

const getStatusClasses = (status) => {
  switch (status) {
    case "Active":
      return "bg-status-green text-white";
    case "On Break":
      return "bg-status-yellow text-status-yellow-dark";
    default:
      return "bg-gray-400 text-white";
  }
};

const WorkerManagement = () => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Worker Management</h2>
        <div className="flex space-x-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
            <FaDownload /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90">
            <FaPlus /> Add Worker
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search workers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <select className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary focus:outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>On Break</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-200">
            <tr>
              {["Worker", "Role", "Location", "Status", "Safety Score", "Last Seen", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="pb-4 text-sm font-bold text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {workersData.map((worker) => (
              <tr key={worker.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-800">{worker.name}</div>
                      <div className="text-sm text-gray-500">{worker.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-700">
                  <div>{worker.role}</div>
                  <div className="text-sm text-gray-500">{worker.shift}</div>
                </td>
                <td className="py-4 text-gray-700">{worker.location}</td>
                <td className="py-4">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClasses(worker.status)}`}
                  >
                    {worker.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">{worker.safetyScore}%</span>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${worker.safetyScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-gray-700">{worker.lastSeen}</td>
                <td className="py-4">
                  <div className="flex items-center gap-4 text-gray-500">
                    <FaEye className="cursor-pointer hover:text-brand-blue" />
                    <FaCog className="cursor-pointer hover:text-brand-blue" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerManagement;
