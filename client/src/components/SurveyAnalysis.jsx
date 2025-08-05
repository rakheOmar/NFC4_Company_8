import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const locations = ["All", "Dhanbad", "Korba", "Singrauli"];

const sentimentData = {
  "Air Quality": [
    { month: "Jan", positive: 20, neutral: 10, negative: 5 },
    { month: "Feb", positive: 25, neutral: 8, negative: 7 },
    { month: "Mar", positive: 22, neutral: 12, negative: 6 },
    { month: "Apr", positive: 30, neutral: 10, negative: 3 },
    { month: "May", positive: 27, neutral: 15, negative: 5 },
    { month: "Jun", positive: 24, neutral: 14, negative: 4 },
    { month: "Jul", positive: 26, neutral: 13, negative: 6 },
    { month: "Aug", positive: 29, neutral: 11, negative: 5 },
    { month: "Sep", positive: 31, neutral: 9, negative: 4 },
    { month: "Oct", positive: 28, neutral: 10, negative: 6 },
    { month: "Nov", positive: 30, neutral: 8, negative: 5 },
    { month: "Dec", positive: 33, neutral: 7, negative: 4 },
  ],
  "General Safety": [
    { month: "Jan", positive: 18, neutral: 14, negative: 6 },
    { month: "Feb", positive: 21, neutral: 13, negative: 6 },
    { month: "Mar", positive: 23, neutral: 12, negative: 5 },
    { month: "Apr", positive: 25, neutral: 11, negative: 4 },
    { month: "May", positive: 24, neutral: 12, negative: 5 },
    { month: "Jun", positive: 26, neutral: 13, negative: 6 },
    { month: "Jul", positive: 27, neutral: 11, negative: 5 },
    { month: "Aug", positive: 29, neutral: 10, negative: 5 },
    { month: "Sep", positive: 28, neutral: 11, negative: 4 },
    { month: "Oct", positive: 30, neutral: 9, negative: 3 },
    { month: "Nov", positive: 32, neutral: 8, negative: 2 },
    { month: "Dec", positive: 34, neutral: 7, negative: 1 },
  ],
};

const pieData = {
  toolsUsed: [
    { name: "Yes", value: 80 },
    { name: "No", value: 20 },
  ],
  equipmentFamiliarity: [
    { name: "Fully Aware", value: 60 },
    { name: "Somewhat Aware", value: 30 },
    { name: "Not Aware", value: 10 },
  ],
};

const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const SurveyAnalysis = () => {
  const [location, setLocation] = useState("All");

  const totalResponses = 300;
  const positive = 190;
  const neutral = 70;
  const negative = 40;

  return (
    <div className="p-8 text-center bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Survey Analysis</h2>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filter by Location:</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Responses</p>
          <h3 className="text-2xl font-semibold text-green-700">{totalResponses}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Positive</p>
          <h3 className="text-2xl font-semibold text-blue-600">{positive}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Neutral</p>
          <h3 className="text-2xl font-semibold text-yellow-600">{neutral}</h3>
        </div>
      </div>

      {Object.keys(sentimentData).map((key) => (
        <div className="mb-12" key={key}>
          <h4 className="text-xl font-semibold mb-2 text-gray-800">{key} Sentiment Over Time</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sentimentData[key]}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="positive" stroke="#10b981" />
              <Line type="monotone" dataKey="neutral" stroke="#f59e0b" />
              <Line type="monotone" dataKey="negative" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded p-4">
          <h5 className="text-lg font-semibold mb-2">Do People Use Safety Tools?</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData.toolsUsed} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.toolsUsed.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h5 className="text-lg font-semibold mb-2">Familiarity with Safety Equipment</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData.equipmentFamiliarity}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
              >
                {pieData.equipmentFamiliarity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalysis;
