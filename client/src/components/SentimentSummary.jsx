import React, { useMemo } from "react";
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
import { faker } from "@faker-js/faker";
import { motion } from "framer-motion";
import { FaRegSmile, FaRegMeh, FaRegFrown, FaUsers } from "react-icons/fa";

// --- THEMED: Colors for charts updated to orange, black, and gray palette ---
const SENTIMENT_COLORS = ["#f97316", "#6b7280", "#1e293b"]; // Orange (Positive), Gray (Neutral), Dark Gray (Negative)
const PIE_COLORS = ["#f97316", "#6b7280", "#94a3b8"]; // Orange (Yes/Good), Gray, Light Gray

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const generateMonthlySentiment = () => {
  return months.map((month) => ({
    month,
    positive: faker.number.int({ min: 20, max: 40 }),
    neutral: faker.number.int({ min: 5, max: 20 }),
    negative: faker.number.int({ min: 2, max: 10 }),
  }));
};

const generatePieData = () => ({
  toolsUsed: [
    { name: "Yes", value: faker.number.int({ min: 60, max: 90 }) },
    { name: "No", value: faker.number.int({ min: 10, max: 40 }) },
  ],
  equipmentFamiliarity: [
    { name: "Fully Aware", value: faker.number.int({ min: 50, max: 80 }) },
    { name: "Somewhat Aware", value: faker.number.int({ min: 10, max: 40 }) },
    { name: "Not Aware", value: faker.number.int({ min: 5, max: 20 }) },
  ],
});

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

// --- NEW: Stat Card Component ---
const StatCard = ({ icon, title, value, colorClass }) => (
  <motion.div
    variants={itemVariants}
    className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className={`text-3xl ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className={`text-3xl font-bold ${colorClass}`}>{value}</h3>
      </div>
    </div>
  </motion.div>
);

const SentimentSummary = () => {
  const airQualityData = useMemo(generateMonthlySentiment, []);
  const safetyData = useMemo(generateMonthlySentiment, []);
  const pieData = useMemo(generatePieData, []);

  const totalResponses = useMemo(() => {
    let total = 0,
      pos = 0,
      neu = 0,
      neg = 0;
    airQualityData.forEach((item) => {
      pos += item.positive;
      neu += item.neutral;
      neg += item.negative;
    });
    total = pos + neu + neg;
    return { total, pos, neu, neg };
  }, [airQualityData]);

  return (
    <div className="bg-white min-h-screen font-sans">
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Survey Sentiment Analysis
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            An overview of community feedback regarding air quality, safety, and operational
            awareness.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <StatCard
            icon={<FaUsers />}
            title="Total Responses"
            value={totalResponses.total}
            colorClass="text-gray-800"
          />
          <StatCard
            icon={<FaRegSmile />}
            title="Positive"
            value={totalResponses.pos}
            colorClass="text-orange-500"
          />
          <StatCard
            icon={<FaRegMeh />}
            title="Neutral"
            value={totalResponses.neu}
            colorClass="text-gray-500"
          />
          <StatCard
            icon={<FaRegFrown />}
            title="Negative"
            value={totalResponses.neg}
            colorClass="text-slate-700"
          />
        </motion.div>

        <motion.div
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Air Quality Sentiment Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={airQualityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke={SENTIMENT_COLORS[0]}
                  strokeWidth={2}
                  name="Positive"
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke={SENTIMENT_COLORS[1]}
                  strokeWidth={2}
                  name="Neutral"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke={SENTIMENT_COLORS[2]}
                  strokeWidth={2}
                  name="Negative"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              General Safety Sentiment Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={safetyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="positive"
                  stroke={SENTIMENT_COLORS[0]}
                  strokeWidth={2}
                  name="Positive"
                />
                <Line
                  type="monotone"
                  dataKey="neutral"
                  stroke={SENTIMENT_COLORS[1]}
                  strokeWidth={2}
                  name="Neutral"
                />
                <Line
                  type="monotone"
                  dataKey="negative"
                  stroke={SENTIMENT_COLORS[2]}
                  strokeWidth={2}
                  name="Negative"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Do People Use Safety Tools?</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData.toolsUsed}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.toolsUsed.map((entry, index) => (
                      <Cell
                        key={`cell-tools-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Familiarity with Safety Equipment
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData.equipmentFamiliarity}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.equipmentFamiliarity.map((entry, index) => (
                      <Cell
                        key={`cell-equip-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SentimentSummary;
