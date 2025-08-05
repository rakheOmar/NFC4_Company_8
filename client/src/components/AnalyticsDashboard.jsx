import React from "react";
import { FaChartBar, FaShieldAlt, FaCheckCircle, FaShieldVirus } from "react-icons/fa";

const ProductionAnalytics = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
      <FaChartBar className="text-gray-400" />
      Production Analytics
    </h3>
    <div className="flex justify-around items-center text-center">
      <div>
        <p className="text-3xl font-bold text-primary">3.75k</p>
        <p className="text-sm text-gray-500">Today's Production (tons)</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-status-green">+12%</p>
        <p className="text-sm text-gray-500">vs Yesterday</p>
      </div>
      <div>
        <p className="text-3xl font-bold text-brand-blue">94%</p>
        <p className="text-sm text-gray-500">Target Achievement</p>
      </div>
    </div>
  </div>
);

// Sub-component for Safety Metrics
const SafetyMetrics = () => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-3 mb-4">
      <FaShieldAlt className="text-gray-400" />
      Safety Metrics
    </h3>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <FaCheckCircle className="text-status-green text-2xl mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">0</p>
        <p className="text-sm text-gray-500">Incidents Today</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <FaShieldVirus className="text-brand-blue text-2xl mx-auto mb-2" />
        <p className="text-2xl font-bold text-gray-800">256</p>
        <p className="text-sm text-gray-500">Days Accident-Free</p>
      </div>
    </div>
    <div>
      <div className="flex justify-between text-sm font-semibold mb-1">
        <span className="text-gray-600">Safety Compliance</span>
        <span className="text-gray-800">96%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full" style={{ width: "96%" }}></div>
      </div>
    </div>
  </div>
);

const AnalyticsDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProductionAnalytics />
      <SafetyMetrics />
    </div>
  );
};

export default AnalyticsDashboard;
