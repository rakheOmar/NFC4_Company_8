// client/src/component/LocationsDashboard.jsx

import React from "react";
import EnvironmentalMap from "./EnvironmentalMap"; // Import the new map component
import { FaThermometerHalf, FaWind } from "react-icons/fa";

// We can keep this component to show aggregate data
const EnvironmentalMonitoring = () => (
  <div className="bg-white p-6 rounded-xl shadow-md h-full">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Regional Monitoring</h3>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="text-center">
        <FaThermometerHalf className="text-red-500 text-3xl mx-auto mb-2" />
        <p className="font-bold text-gray-800">Avg Temperature</p>
        <p className="text-xl text-gray-600">29°C</p>
      </div>
      <div className="text-center">
        <FaWind className="text-blue-500 text-3xl mx-auto mb-2" />
        <p className="font-bold text-gray-800">Air Quality</p>
        <p className="text-xl text-yellow-600 font-semibold">Moderate</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-semibold">Gas Level Monitoring</span>
        <span className="text-green-600 font-semibold px-2 py-0.5 bg-green-100 rounded-full text-sm">
          Normal
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-semibold">Ventilation System</span>
        <span className="text-green-600 font-semibold px-2 py-0.5 bg-green-100 rounded-full text-sm">
          Optimal
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600 font-semibold">Emergency Systems</span>
        <span className="text-green-600 font-semibold px-2 py-0.5 bg-green-100 rounded-full text-sm">
          Active
        </span>
      </div>
    </div>
  </div>
);

const LocationsDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {/* The new map component is rendered here */}
        <EnvironmentalMap />
      </div>
      <div className="lg:col-span-1">
        <EnvironmentalMonitoring />
      </div>
    </div>
  );
};

export default LocationsDashboard;
