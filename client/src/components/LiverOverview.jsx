import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { motion } from "framer-motion";

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

  if (loading) {
    return (
      <div className="text-center py-10 dark:text-gray-300">
        Loading live overview...
      </div>
    );
  }

  // Define the animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <style>
        {`
          @keyframes border-pulse-green {
            0% { border-color: #d1fae5; }
            50% { border-color: #34d399; }
            100% { border-color: #d1fae5; }
          }

          @keyframes border-pulse-orange {
            0% { border-color: #fff7ed; }
            50% { border-color: #fbbf24; }
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
      <section className="py-10 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-slate-200">
            Live Overview
          </h2>

          {/* Wrap the grid in a motion.div to control the stagger */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <motion.div
              className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-sm border-4 card-border-green"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200">
                  Workers
                </h3>
                <span className="text-green-500 dark:text-green-400 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></span>
                  LIVE
                </span>
              </div>
              <div className="text-xl text-gray-700 dark:text-slate-300">
                Total: <span className="font-bold">{data.totalWorkers}</span>
              </div>
              <div className="text-xl text-green-600 dark:text-green-500">
                Safe Now: <span className="font-bold">{data.workersSafe}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                ↑ {data.workersChange} workers since shift start
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-sm border-4 card-border-orange"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200">
                  Machines
                </h3>
                <span className="text-orange-500 dark:text-orange-400 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-400"></span>
                  LIVE
                </span>
              </div>
              <div className="text-xl text-gray-700 dark:text-slate-300">
                Total: <span className="font-bold">{data.totalMachines}</span>
              </div>
              <div className="text-xl text-orange-700 dark:text-orange-500">
                Running:{" "}
                <span className="font-bold">{data.machinesRunning}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                {data.machineEfficiency}% operational efficiency
              </p>
            </motion.div>

            <motion.div
              className="rounded-lg bg-white dark:bg-slate-800 p-6 shadow-sm border-4 card-border-green"
              variants={itemVariants}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-slate-200">
                  Air Quality Index
                </h3>
                <span className="text-green-500 dark:text-green-400 text-sm flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400"></span>
                  LIVE
                </span>
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-500">
                Good
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                AQI: 45
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LiveOverview;