import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

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
  {
    name: "Western Mine C",
    location: "Korba, Chhattisgarh",
    status: "Safe",
    activeWorkers: "32/40",
    production: "1520t",
    capacity: 80,
    envScore: 92,
    lastInspection: "1/16/2024",
  },
];

// Reusable Mine Card Component
const MineCard = ({ mine }) => {
  const statusClasses =
    mine.status === "Safe" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{mine.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FaMapMarkerAlt /> {mine.location}
          </p>
        </div>
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusClasses}`}>
          {mine.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Active Workers</p>
          <p className="text-xl font-bold text-primary">{mine.activeWorkers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Production Today</p>
          <p className="text-xl font-bold text-brand-blue">{mine.production}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span className="text-gray-600">Capacity Utilization</span>
            <span className="text-gray-800">{mine.capacity}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${mine.capacity}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span className="text-gray-600">Environmental Score</span>
            <span className="text-gray-800">{mine.envScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${mine.envScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 text-sm text-gray-500">
        Last Inspection: {mine.lastInspection}
      </div>
    </div>
  );
};

const MinesDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {minesData.map((mine) => (
        <MineCard key={mine.name} mine={mine} />
      ))}
    </div>
  );
};

export default MinesDashboard;
