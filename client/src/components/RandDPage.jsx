import React from "react";
import { Link } from "react-router-dom";
import {
  FaProjectDiagram,
  FaBalanceScale,
  FaShieldAlt,
  FaLeaf,
  FaClock,
  FaChartPie,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Function to generate random data for productionData
const generateRandomProductionData = () => {
  const getRandomValue = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

  const cilProduction = getRandomValue(100, 150);
  const cilOfftake = getRandomValue(120, 160);
  const scclProduction = getRandomValue(10, 15);
  const scclOfftake = getRandomValue(10, 15);
  const captiveProduction = getRandomValue(25, 40);
  const captiveOfftake = getRandomValue(30, 45);

  const totalProduction = cilProduction + scclProduction + captiveProduction;
  const totalOfftake = cilOfftake + scclOfftake + captiveOfftake;

  return [
    {
      name: "CIL",
      production: cilProduction,
      targetProduction: 875.0,
      offtake: cilOfftake,
      targetOfftake: 900.0,
    },
    {
      name: "SCCL",
      production: scclProduction,
      targetProduction: 72.0,
      offtake: scclOfftake,
      targetOfftake: 72.0,
    },
    {
      name: "Captive & Others",
      production: captiveProduction,
      targetProduction: 210.0,
      offtake: captiveOfftake,
      targetOfftake: 210.0,
    },
    {
      name: "Total",
      production: parseFloat(totalProduction.toFixed(2)),
      targetProduction: 1157.0,
      offtake: parseFloat(totalOfftake.toFixed(2)),
      targetOfftake: 1182.0,
    },
  ];
};

// Function to generate random data for importData
const generateRandomImportData = () => {
  const getRandomValue = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

  return [
    {
      name: "2020-21",
      coking: getRandomValue(50, 60),
      nonCoking: getRandomValue(150, 170),
      total: getRandomValue(200, 230),
    },
    {
      name: "2021-22",
      coking: getRandomValue(55, 65),
      nonCoking: getRandomValue(140, 160),
      total: getRandomValue(190, 220),
    },
    {
      name: "2022-23",
      coking: getRandomValue(50, 60),
      nonCoking: getRandomValue(170, 190),
      total: getRandomValue(220, 250),
    },
    {
      name: "2023-24",
      coking: getRandomValue(55, 65),
      nonCoking: getRandomValue(190, 210),
      total: getRandomValue(250, 270),
    },
    {
      name: "2024-25",
      coking: getRandomValue(50, 60),
      nonCoking: getRandomValue(170, 190),
      total: getRandomValue(220, 250),
    },
    {
      name: "2025-26*",
      coking: getRandomValue(10, 15),
      nonCoking: getRandomValue(35, 45),
      total: getRandomValue(45, 60),
    },
  ];
};

// Initialize data with random values on component load
const initialProductionData = generateRandomProductionData();
const initialImportData = generateRandomImportData();

// --- Feature Card Component ---
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="text-primary text-2xl mb-3">{icon}</div>
    <h3 className="font-bold text-lg text-gray-800 mb-1">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// --- Project Item Component ---
const ProjectItem = ({ id, status, title, budget, lead, progress, duration }) => {
  const statusClass =
    status === "In Progress" ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-800";
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs font-semibold text-gray-500">{id}</span>
          <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${statusClass}`}>
            {status}
          </span>
        </div>
        <span className="text-xs text-gray-500">{duration}</span>
      </div>
      <h4 className="font-bold text-lg text-gray-900">{title}</h4>
      <div className="text-sm text-gray-600 mt-1">
        <span>
          Budget: <span className="font-semibold">{budget}</span>
        </span>
        <span className="mx-2">|</span>
        <span>
          Lead: <span className="font-semibold">{lead}</span>
        </span>
      </div>
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// --- Main R&D Page Component ---
const RandDPage = () => {
  const features = [
    {
      icon: <FaProjectDiagram />,
      title: "Project Lifecycle Tracking",
      description: "Complete visibility into R&D project phases from conception to implementation.",
    },
    {
      icon: <FaBalanceScale />,
      title: "Budget vs Utilization",
      description: "Real-time tracking of project budgets, expenses, and resource allocation.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Safety & Compliance",
      description: "Monitor safety protocols and ensure regulatory compliance across all projects.",
    },
    {
      icon: <FaLeaf />,
      title: "Environmental Impact",
      description: "Track carbon emissions and environmental metrics for sustainable mining.",
    },
    {
      icon: <FaClock />,
      title: "Timeline Management",
      description: "Advanced project scheduling and milestone tracking for timely delivery.",
    },
    {
      icon: <FaChartPie />,
      title: "Outcome Analytics",
      description: "Measure project success rates and innovation impact on operations.",
    },
  ];

  const projects = [
    {
      id: "RD-2025-001",
      status: "In Progress",
      title: "AI-Powered Safety Monitoring System",
      budget: "₹2.1Cr",
      lead: "Dr. Priya Sharma",
      progress: 65,
      duration: "8 months",
    },
    {
      id: "RD-2025-002",
      status: "Planning",
      title: "Carbon Emission Reduction Technology",
      budget: "₹3.5Cr",
      lead: "Prof. Raj Kumar",
      progress: 15,
      duration: "12 months",
    },
    {
      id: "RD-2025-003",
      status: "In Progress",
      title: "Automated Coal Quality Assessment",
      budget: "₹1.8Cr",
      lead: "Dr. Amit Singh",
      progress: 42,
      duration: "6 months",
    },
  ];

  // Function to save data to sessionStorage before navigating
  const handleTipsClick = () => {
    sessionStorage.setItem("productionData", JSON.stringify(initialProductionData));
    sessionStorage.setItem("importData", JSON.stringify(initialImportData));
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <style>
        {`
                .recharts-default-tooltip {
                    border-radius: 8px !important;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                }
                .data-table th, .data-table td {
                    text-align: left;
                    padding: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }
                .data-table tr:last-child td {
                    font-weight: bold;
                }
                `}
      </style>

      {/* The <header> element has been removed from here to prevent the duplicate navbar */}

      <main className="max-w-7xl mx-auto py-12 px-8">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-5xl font-bold text-gray-800">Transforming Coal Mining</h1>
          <h2 className="text-5xl font-bold text-blue-600">Through Innovation</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mt-4">
            Digital management platform for R&D and S&T projects in coal mining. Track project
            lifecycles, monitor budgets, ensure safety compliance, and drive sustainable innovation.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <a
              href="https://coal.nic.in/en/major-statistics/coal-statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View R&D Dashboard →
            </a>
            <a
              href="https://coal.nic.in/en/major-statistics/production-and-supplies"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Projects
            </a>
          </div>
        </section>

        {/* Charts Section */}
        <section className="mt-16 space-y-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-gray-800">
                Coal Production & Offtake (August 2025, in MT)
              </h3>
              <a
                href="/rnd-tips"
                onClick={handleTipsClick}
                className="bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                R&D Management Tips →
              </a>
            </div>
            <p className="text-sm text-gray-500 mb-4">Source: DDG Office, Ministry of Coal</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left text-gray-500 data-table">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="py-3 px-6">Company</th>
                    <th className="py-3 px-6">
                      Production*
                      <br />
                      Target
                    </th>
                    <th className="py-3 px-6">
                      Production*
                      <br />
                      Ach. (Prov)
                    </th>
                    <th className="py-3 px-6">
                      Offtake/Dispatch*
                      <br />
                      Target
                    </th>
                    <th className="py-3 px-6">
                      Offtake/Dispatch*
                      <br />
                      Ach. (Prov.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {initialProductionData.map((row, index) => (
                    <tr key={index} className="bg-white border-b">
                      <td className="py-4 px-6">{row.name}</td>
                      <td className="py-4 px-6">{row.targetProduction.toFixed(2)}</td>
                      <td className="py-4 px-6">{row.production}</td>
                      <td className="py-4 px-6">{row.targetOfftake.toFixed(2)}</td>
                      <td className="py-4 px-6">{row.offtake}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={initialProductionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="production" fill="#3b82f6" name="Production" />
                <Bar dataKey="offtake" fill="#10b981" name="Offtake/Dispatch" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Coal & Coke Import (Million Tonnes)
            </h3>
            <p className="text-sm text-gray-500 mb-4">Source: DDG Office, Ministry of Coal</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left text-gray-500 data-table">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="py-3 px-6">Coal</th>
                    {initialImportData.map((row, index) => (
                      <th key={index} className="py-3 px-6">
                        {row.name.replace("*", "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b">
                    <td className="py-4 px-6">Coking Coal</td>
                    {initialImportData.map((row, index) => (
                      <td key={index} className="py-4 px-6">
                        {row.coking}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-white border-b">
                    <td className="py-4 px-6">Non-Coking Coal</td>
                    {initialImportData.map((row, index) => (
                      <td key={index} className="py-4 px-6">
                        {row.nonCoking}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-white border-b font-bold">
                    <td className="py-4 px-6">Total Coal Import</td>
                    {initialImportData.map((row, index) => (
                      <td key={index} className="py-4 px-6">
                        {row.total}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={initialImportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="coking"
                  stroke="#ef4444"
                  activeDot={{ r: 8 }}
                  name="Coking Coal"
                />
                <Line
                  type="monotone"
                  dataKey="nonCoking"
                  stroke="#22c55e"
                  activeDot={{ r: 8 }}
                  name="Non-Coking Coal"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  name="Total Import"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>

        {/* Recent Projects Section */}
        <section className="bg-white p-6 rounded-lg border border-gray-200 mt-16">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recent R&D Projects</h3>
            <a
              href="https://coal.nic.in/en/tenders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View All Projects
            </a>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectItem key={project.id} {...project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default RandDPage;
