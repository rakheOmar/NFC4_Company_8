import React, { useState, useEffect } from "react";
import { FaChartLine, FaBullseye, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
} from "recharts";

// --- THEMED: Colors for charts updated to orange, black, and gray palette ---
const COLORS = ["#f97316", "#4b5563", "#f59e0b", "#1e293b", "#94a3b8"];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// --- THEMED: Insight Card Component ---
const InsightCard = ({ icon, title, value, description, status }) => {
  const statusColors = {
    good: "border-orange-500 bg-orange-50",
    warning: "border-orange-500 bg-orange-50",
    neutral: "border-gray-500 bg-gray-50",
  };
  const valueColors = {
    good: "text-orange-600",
    warning: "text-orange-600",
    neutral: "text-gray-600",
  };

  return (
    <div className={`p-6 rounded-lg border-l-4 ${statusColors[status] || statusColors.neutral}`}>
      <div className="flex items-start gap-4">
        <div className={`text-2xl ${valueColors[status] || valueColors.neutral}`}>{icon}</div>
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${valueColors[status] || valueColors.neutral}`}>
            {value}
          </p>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// --- Main R&D Tips Page Component ---
const RndTipsPage = () => {
  const [insights, setInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importChartData, setImportChartData] = useState([]);
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    const storedProductionData = sessionStorage.getItem("productionData");
    const storedImportData = sessionStorage.getItem("importData");

    if (storedProductionData && storedImportData) {
      const productionData = JSON.parse(storedProductionData);
      const importData = JSON.parse(storedImportData);
      setImportChartData(importData);

      const totalProdData = productionData.find((d) => d.name === "Total");
      const productionAchievement =
        (totalProdData.production / totalProdData.targetProduction) * 100;
      const offtakeAchievement = (totalProdData.offtake / totalProdData.targetOfftake) * 100;

      const prodInsight = {
        icon: <FaBullseye />,
        title: "Production vs. Target",
        value: `${productionAchievement.toFixed(1)}%`,
        description: `Achieved ${totalProdData.production} MT out of ${totalProdData.targetProduction.toFixed(2)} MT target.`,
        status: productionAchievement >= 15 ? "good" : "warning",
      };

      const offtakeInsight = {
        icon: <FaChartLine />,
        title: "Offtake vs. Target",
        value: `${offtakeAchievement.toFixed(1)}%`,
        description: `Dispatched ${totalProdData.offtake} MT out of ${totalProdData.targetOfftake.toFixed(2)} MT target.`,
        status: offtakeAchievement >= 15 ? "good" : "warning",
      };

      const latestFullYear = importData.find((d) => d.name === "2024-25");
      const previousYear = importData.find((d) => d.name === "2023-24");
      const trend = latestFullYear.total - previousYear.total;
      const trendPercentage = (trend / previousYear.total) * 100;

      const importTrendInsight = {
        icon: trend > 0 ? <FaArrowUp /> : <FaArrowDown />,
        title: "Total Import Trend (YoY)",
        value: `${trend > 0 ? "+" : ""}${trendPercentage.toFixed(1)}%`,
        description: `Total imports have ${trend > 0 ? "increased" : "decreased"} by ${Math.abs(trend).toFixed(2)} MT compared to the previous year.`,
        status: trend > 0 ? "warning" : "good",
      };

      const companyProduction = productionData
        .filter((d) => d.name !== "Total")
        .map((d) => ({
          name: d.name,
          production: d.production,
          target: d.targetProduction,
          achievement: parseFloat(((d.production / d.targetProduction) * 100).toFixed(1)),
          fill: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));

      setInsights([prodInsight, offtakeInsight, importTrendInsight]);
      setCompanyData(companyProduction);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-600">Loading Insights...</div>;
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No Data Available</h1>
        <p className="text-gray-600 mb-8">
          Please go back to the R&D page and click the "R&D Management Tips" button first.
        </p>
        <a
          href="/"
          className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors"
        >
          ← Back to R&D Page
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto py-12 px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800 mb-2"
        >
          Management Tips & Insights
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-gray-600 mb-10"
        >
          Key performance indicators and trends based on the latest data from the R&D dashboard.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {insights.map((insight, index) => (
            <motion.div key={index} variants={itemVariants}>
              <InsightCard {...insight} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Production Share by Company</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={companyData}
                  dataKey="production"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Target vs Actual Production</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={companyData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#4b5563"
                  fill="#4b5563"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Actual"
                  dataKey="production"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.7}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Production Achievement (%)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="15%"
                outerRadius="90%"
                barSize={10}
                data={companyData}
              >
                <RadialBar
                  minAngle={15}
                  label={{ position: "insideStart", fill: "#fff" }}
                  background
                  clockWise
                  dataKey="achievement"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default RndTipsPage;
