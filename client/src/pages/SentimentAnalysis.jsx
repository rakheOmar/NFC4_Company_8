import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { faker } from '@faker-js/faker';

// Generate sample data for each month for two survey topics
const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const generateMonthlySentiment = () => {
  return months.map(month => ({
    month,
    positive: faker.number.int({ min: 20, max: 40 }),
    neutral: faker.number.int({ min: 5, max: 20 }),
    negative: faker.number.int({ min: 2, max: 10 })
  }));
};

const generatePieData = () => ({
  toolsUsed: [
    { name: 'Yes', value: faker.number.int({ min: 60, max: 90 }) },
    { name: 'No', value: faker.number.int({ min: 10, max: 40 }) },
  ],
  equipmentFamiliarity: [
    { name: 'Fully Aware', value: faker.number.int({ min: 50, max: 80 }) },
    { name: 'Somewhat Aware', value: faker.number.int({ min: 10, max: 40 }) },
    { name: 'Not Aware', value: faker.number.int({ min: 5, max: 20 }) },
  ]
});

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

const SentimentSummary = () => {
  const airQualityData = useMemo(generateMonthlySentiment, []);
  const safetyData = useMemo(generateMonthlySentiment, []);
  const pieData = useMemo(generatePieData, []);

  const totalResponses = useMemo(() => {
    let total = 0, pos = 0, neu = 0, neg = 0;
    airQualityData.forEach(item => {
      pos += item.positive;
      neu += item.neutral;
      neg += item.negative;
    });
    total = pos + neu + neg;
    return { total, pos, neu, neg };
  }, [airQualityData]);

  return (
    <div className="p-8 text-center bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📊 Survey Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Total Responses</p>
          <h3 className="text-2xl font-semibold text-green-700">{totalResponses.total}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Positive</p>
          <h3 className="text-2xl font-semibold text-blue-600">{totalResponses.pos}</h3>
        </div>
        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500 text-sm">Neutral</p>
          <h3 className="text-2xl font-semibold text-yellow-600">{totalResponses.neu}</h3>
        </div>
      </div>

      <div className="mb-12">
        <h4 className="text-xl font-semibold mb-2 text-gray-800">Air Quality Sentiment Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={airQualityData}>
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

      <div className="mb-12">
        <h4 className="text-xl font-semibold mb-2 text-gray-800">General Safety Sentiment Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safetyData}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded p-4">
          <h5 className="text-lg font-semibold mb-2">Do People Use Safety Tools?</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData.toolsUsed} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.toolsUsed.map((entry, index) => (
                  <Cell key={`cell-tools-${index}`} fill={COLORS[index % COLORS.length]} />
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
              <Pie data={pieData.equipmentFamiliarity} dataKey="value" nameKey="name" outerRadius={80}>
                {pieData.equipmentFamiliarity.map((entry, index) => (
                  <Cell key={`cell-equip-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default SentimentSummary;
