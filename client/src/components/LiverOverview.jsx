import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";

const LiveOverview = () => {
  const [data, setData] = useState({
    totalWorkers: 0,
    workersSafe: 0,
    workersChange: 0,
    totalMachines: 0,
    machinesRunning: 0,
    machineEfficiency: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/dashboard/live-overview");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch live overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-10">Loading live overview...</div>;

  return (
    <>
      {/* Custom styles for the moving border effect */}
      <style>
        {`
          @keyframes border-pulse-green {
            0% { border-color: #d1fae5; } /* Tailwind green-100 */
            50% { border-color: #34d399; } /* Tailwind green-400 */
            100% { border-color: #d1fae5; }
          }

          @keyframes border-pulse-orange {
            0% { border-color: #fff7ed; } /* Tailwind orange-100 */
            50% { border-color: #fbbf24; } /* Tailwind orange-400 */
            100% { border-color: #fff7ed; }
          }

          .card-border-green {
            animation: border-pulse-green 3s infinite ease-in-out;
          }

          .card-border-orange {
            animation: border-pulse-orange 3s infinite ease-in-out;
          }
        `}
      </style>
      <section className="py-10 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Live Overview</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Workers Card */}
            <div className="rounded-lg bg-white p-6 shadow-sm border-4 card-border-green">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Workers</h3>
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> LIVE
                </span>
              </div>
              <div className="text-xl text-gray-700">
                Total: <span className="font-bold">{data.totalWorkers}</span>
              </div>
              <div className="text-xl text-green-600">
                Safe Now: <span className="font-bold">{data.workersSafe}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                ↑ {data.workersChange} workers since shift start
              </p>
            </div>

            {/* Machines Card */}
            <div className="rounded-lg bg-white p-6 shadow-sm border-4 card-border-orange">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Machines</h3>
                <span className="text-orange-500 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span> LIVE
                </span>
              </div>
              <div className="text-xl text-gray-700">
                Total: <span className="font-bold">{data.totalMachines}</span>
              </div>
              <div className="text-xl text-orange-700">
                Running: <span className="font-bold">{data.machinesRunning}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {data.machineEfficiency}% operational efficiency
              </p>
            </div>

            {/* AQI static for now */}
            <div className="rounded-lg bg-white p-6 shadow-sm border-4 card-border-green">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Air Quality Index</h3>
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> LIVE
                </span>
              </div>
              <div className="text-3xl font-bold text-green-600">Good</div>
              <p className="text-sm text-gray-600 mt-1">AQI: 45</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LiveOverview;
