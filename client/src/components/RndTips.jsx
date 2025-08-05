import React, { useState, useEffect } from "react";
import { FaChartLine, FaBullseye, FaArrowUp, FaArrowDown } from "react-icons/fa";
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

// Colors for charts
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

// --- Insight Card Component ---
const InsightCard = ({ icon, title, value, description, status }) => {
  const statusColors = {
    good: "border-green-500 bg-green-50",
    warning: "border-yellow-500 bg-yellow-50",
    neutral: "border-blue-500 bg-blue-50",
  };
  const valueColors = {
    good: "text-green-600",
    warning: "text-yellow-600",
    neutral: "text-blue-600",
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
        status: productionAchievement >= 95 ? "good" : "warning",
      };

      const offtakeInsight = {
        icon: <FaChartLine />,
        title: "Offtake vs. Target",
        value: `${offtakeAchievement.toFixed(1)}%`,
        description: `Dispatched ${totalProdData.offtake} MT out of ${totalProdData.targetOfftake.toFixed(2)} MT target.`,
        status: offtakeAchievement >= 95 ? "good" : "warning",
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
          achievement: (d.production / d.targetProduction) * 100,
        }));

      setInsights([prodInsight, offtakeInsight, importTrendInsight]);
      setCompanyData(companyProduction);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading Insights...</div>;
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No Data Available</h1>
        <p className="text-gray-600 mb-8">
          Please go back to the dashboard and click the "R&D Management Tips" button first.
        </p>
        <a
          href="/"
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto py-12 px-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Management Tips & Insights</h1>
        <p className="text-lg text-gray-600 mb-10">
          Key performance indicators and trends based on the latest data from the dashboard.
        </p>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {insights.map((insight, index) => (
            <InsightCard key={index} {...insight} />
          ))}
        </div>

        {/* Additional Charts on Production Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          {/* Pie Chart: Production Distribution */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Production Share by Company</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={companyData}
                  dataKey="production"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {companyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart: Target vs Actual */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Target vs Actual Production</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={companyData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                />
                <Radar
                  name="Actual"
                  dataKey="production"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* RadialBar Chart: Achievement % */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Production Achievement (%)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="90%"
                barSize={15}
                data={companyData}
              >
                <PolarAngleAxis type="category" dataKey="name" />
                <RadialBar background clockWise dataKey="achievement" />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RndTipsPage;
