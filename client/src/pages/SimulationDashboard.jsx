import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "@/lib/axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AlertCircle, FileTerminal, ShieldAlert, Save, Bot, Users, Battery } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Leaflet marker fix for bundlers like Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Helper function to generate and open the new AI report ---
const displayAiReportInNewTab = (reportData) => {
  const { workerData, airQuality, incidents, carbonFootprint } = reportData;

  // --- 1. Calculate Metrics & Scores ---
  const totalIncidents = incidents.length;
  const ppeNonComplianceCount = workerData.filter((w) => !w.ppeStatus.helmet).length;
  const criticalWorkersCount = workerData.filter((w) => w.status === "Critical Fatigue").length;
  const equipmentFailures = incidents.filter((i) => i.type === "HAZARD_REPORT").length; // Re-purposing for this metric
  const highSeverityIncidents = incidents.filter((i) => i.severity === "High").length;

  const avgFatigue =
    workerData.length > 0
      ? workerData.reduce((acc, w) => acc + w.fatigue, 0) / workerData.length
      : 0;
  const ppeCompliance =
    workerData.length > 0
      ? ((workerData.length - ppeNonComplianceCount) / workerData.length) * 100
      : 100;

  // Simple scoring logic (0-100)
  const safetyScore = Math.max(
    0,
    100 - criticalWorkersCount * 20 - highSeverityIncidents * 15 - ppeNonComplianceCount * 5
  );
  const operationalScore = Math.max(0, 100 - avgFatigue * 0.7 - equipmentFailures * 25);
  const environmentalScore = Math.max(
    0,
    100 - carbonFootprint * 0.5 - airQuality.filter((r) => r.CO > 4.5).length * 10
  );
  const overallScore = safetyScore * 0.5 + operationalScore * 0.3 + environmentalScore * 0.2;

  let riskLevel = "MODERATE RISK";
  let riskColor = "text-yellow-500";
  if (overallScore < 40) {
    riskLevel = "CRITICAL RISK";
    riskColor = "text-red-600";
  } else if (overallScore < 70) {
    riskLevel = "HIGH RISK";
    riskColor = "text-orange-500";
  }

  // --- 2. Prepare Data for Charts ---
  const incidentCounts = incidents.reduce((acc, incident) => {
    const type = incident.type.replace(/_/g, " ");
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const workerFatigueForChart = workerData.map((w) => ({
    name: w.fullname,
    fatigue: w.fatigue.toFixed(1),
  }));

  // --- 3. Generate Dynamic HTML Content ---
  const keyFindingsHtml = `
    ${criticalWorkersCount > 0 ? `<li class="flex items-center gap-3"><svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span><b>${criticalWorkersCount} worker(s)</b> in critical condition requiring immediate attention</span></li>` : ""}
    ${equipmentFailures > 0 ? `<li class="flex items-center gap-3"><svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span><b>${equipmentFailures} equipment failure(s)</b> detected</span></li>` : ""}
    ${ppeCompliance < 90 ? `<li class="flex items-center gap-3"><svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span><b>PPE compliance at ${ppeCompliance.toFixed(1)}%</b> - below safety standards</span></li>` : ""}
    ${highSeverityIncidents > 0 ? `<li class="flex items-center gap-3"><svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span><b>${highSeverityIncidents} critical incident(s)</b> require immediate response</span></li>` : ""}
    ${carbonFootprint > 50 ? `<li class="flex items-center gap-3"><svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> <span><b>Carbon emissions at ${carbonFootprint.toFixed(1)} kg CO₂</b> - environmental concern</span></li>` : ""}
  `;

  const criticalActionsHtml = `
    ${criticalWorkersCount > 0 ? `<div class="bg-red-100/80 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg flex justify-between items-center"><div><p class="font-bold">EVACUATE CRITICAL WORKERS</p><p class="text-sm">Workers showing critical fatigue signs must be evacuated immediately.</p></div><span class="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">IMMEDIATE</span></div>` : ""}
    ${equipmentFailures > 0 ? `<div class="bg-red-100/80 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg flex justify-between items-center"><div><p class="font-bold">EQUIPMENT SHUTDOWN</p><p class="text-sm">Affected equipment poses safety risks and must be shut down.</p></div><span class="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">IMMEDIATE</span></div>` : ""}
    ${ppeCompliance < 90 ? `<div class="bg-orange-100/80 border-l-4 border-orange-500 text-orange-800 p-4 rounded-r-lg flex justify-between items-center"><div><p class="font-bold">PPE ENFORCEMENT</p><p class="text-sm">All workers must have proper PPE before continuing operations.</p></div><span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">HIGH</span></div>` : ""}
    ${totalIncidents > 0 ? `<div class="bg-orange-100/80 border-l-4 border-orange-500 text-orange-800 p-4 rounded-r-lg flex justify-between items-center"><div><p class="font-bold">SAFETY BRIEFING</p><p class="text-sm">Conduct immediate safety briefing with all personnel.</p></div><span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">HIGH</span></div>` : ""}
  `;

  // --- 4. Main HTML Structure ---
  const reportHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprehensive Operations Diagnosis</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <style> body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; } </style>
    </head>
    <body class="text-gray-800">
        <div class="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <header class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-extrabold text-gray-900">Comprehensive Operations Diagnosis</h1>
                    <p class="text-sm text-gray-500 mt-1">Generated: ${new Date().toLocaleString()}</p>
                </div>
            </header>

            <section class="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Overall Risk Assessment</h2>
                <p class="text-4xl font-bold ${riskColor} mt-2">${riskLevel}</p>
                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                        <span class="text-4xl font-bold text-red-500">${safetyScore.toFixed(0)}</span>
                        <h3 class="font-semibold text-gray-700 mt-1">Safety Score</h3>
                        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div class="bg-red-500 h-1.5 rounded-full" style="width: ${safetyScore}%"></div></div>
                    </div>
                    <div>
                        <span class="text-4xl font-bold text-orange-500">${operationalScore.toFixed(0)}</span>
                        <h3 class="font-semibold text-gray-700 mt-1">Operational Score</h3>
                        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div class="bg-orange-500 h-1.5 rounded-full" style="width: ${operationalScore}%"></div></div>
                    </div>
                    <div>
                        <span class="text-4xl font-bold text-green-500">${environmentalScore.toFixed(0)}</span>
                        <h3 class="font-semibold text-gray-700 mt-1">Environmental Score</h3>
                        <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2"><div class="bg-green-500 h-1.5 rounded-full" style="width: ${environmentalScore}%"></div></div>
                    </div>
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section class="p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h2 class="text-lg font-bold text-yellow-900 mb-3">Key Findings</h2>
                    <ul class="space-y-3 text-sm text-yellow-800">${keyFindingsHtml}</ul>
                </section>
                <section class="space-y-3">
                    <h2 class="text-lg font-bold text-gray-900 px-1 mb-2">Critical Actions Required</h2>
                    ${criticalActionsHtml}
                </section>
            </div>
            
            <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-5 bg-red-50 rounded-xl border border-red-200">
                    <h3 class="font-bold text-red-800">Immediate Actions</h3>
                    <ul class="mt-2 space-y-2 list-disc list-inside text-sm text-red-700/90">
                        <li>Evacuate and provide medical attention to critical workers immediately</li>
                        <li>Shut down failed equipment and isolate affected areas</li>
                        <li>Deploy emergency response teams to incident locations</li>
                        <li>Enforce mandatory helmet policy - no exceptions</li>
                    </ul>
                </div>
                <div class="p-5 bg-yellow-50 rounded-xl border border-yellow-200">
                    <h3 class="font-bold text-yellow-800">Short-term (1-7 days)</h3>
                    <ul class="mt-2 space-y-2 list-disc list-inside text-sm text-yellow-700/90">
                        <li>Conduct PPE training and compliance checks</li>
                        <li>Install additional environmental monitoring sensors</li>
                        <li>Establish worker rotation schedules to prevent fatigue buildup</li>
                    </ul>
                </div>
                <div class="p-5 bg-blue-50 rounded-xl border border-blue-200">
                    <h3 class="font-bold text-blue-800">Long-term (1+ months)</h3>
                    <ul class="mt-2 space-y-2 list-disc list-inside text-sm text-blue-700/90">
                        <li>Implement AI-powered prediction maintenance system</li>
                        <li>Deploy wearable health monitoring devices for all workers</li>
                        <li>Establish comprehensive safety training program</li>
                        <li>Invest in cleaner equipment to reduce carbon footprint</li>
                        <li>Create automated incident response protocols</li>
                        <li>Develop real-time dashboard for continuous monitoring</li>
                    </ul>
                </div>
            </section>

            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Detailed Metrics</h2>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="p-3 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">Avg. Fatigue</p><p class="text-xl font-bold">${avgFatigue.toFixed(1)}%</p></div>
                        <div class="p-3 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">PPE Compliance</p><p class="text-xl font-bold">${ppeCompliance.toFixed(1)}%</p></div>
                        <div class="p-3 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">Total Incidents</p><p class="text-xl font-bold">${totalIncidents}</p></div>
                        <div class="p-3 bg-gray-50 rounded-lg"><p class="text-xs text-gray-500">kg CO₂</p><p class="text-xl font-bold">${carbonFootprint.toFixed(1)}</p></div>
                    </div>
                </div>
                <div class="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 class="font-semibold text-center mb-2">Worker Fatigue Levels</h3>
                    <div class="h-48"><canvas id="fatigueChart"></canvas></div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 class="font-semibold text-center mb-2">Incident Summary</h3>
                    <div class="h-64 flex justify-center"><canvas id="incidentChart"></canvas></div>
                </div>
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 class="font-semibold text-center mb-2">Air Quality Readings (CO & NO₂)</h3>
                    <div class="h-64"><canvas id="airQualityChart"></canvas></div>
                </div>
            </div>
        </div>

        <script>
            const workerFatigueData = ${JSON.stringify(workerFatigueForChart)};
            const airQualityData = ${JSON.stringify(airQuality)};
            const incidentData = ${JSON.stringify(incidentCounts)};

            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { 
                    y: { beginAtZero: true, grid: { color: '#e5e7eb' } },
                    x: { grid: { display: false } }
                }
            };
            
            // Chart 1: Worker Fatigue
            new Chart(document.getElementById('fatigueChart'), {
                type: 'bar',
                data: {
                    labels: workerFatigueData.map(w => w.name),
                    datasets: [{
                        label: 'Fatigue Level (%)',
                        data: workerFatigueData.map(w => w.fatigue),
                        backgroundColor: workerFatigueData.map(w => w.fatigue > 75 ? '#ef4444' : w.fatigue > 50 ? '#f97316' : '#22c55e'),
                        borderRadius: 4,
                    }]
                },
                options: { ...chartOptions, scales: { y: { beginAtZero: true, max: 100, grid: { color: '#e5e7eb' } }, x: { grid: { display: false } } } }
            });

            // Chart 2: Incident Summary
            new Chart(document.getElementById('incidentChart'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(incidentData),
                    datasets: [{
                        label: 'Incident Count',
                        data: Object.values(incidentData),
                        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#8b5cf6'],
                        borderColor: '#ffffff',
                        borderWidth: 2,
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' }}}
            });

            // Chart 3: Air Quality
            new Chart(document.getElementById('airQualityChart'), {
                type: 'line',
                data: {
                    labels: airQualityData.map(d => d.time),
                    datasets: [
                        { label: 'CO Levels (ppm)', data: airQualityData.map(d => d.CO), borderColor: '#8884d8', backgroundColor: '#8884d820', fill: true, tension: 0.3 },
                        { label: 'NO₂ Levels (ppm)', data: airQualityData.map(d => d.NO2), borderColor: '#82ca9d', backgroundColor: '#82ca9d20', fill: true, tension: 0.3 }
                    ]
                },
                options: chartOptions
            });
        </script>
    </body>
    </html>
  `;

  const reportBlob = new Blob([reportHtml], { type: "text/html" });
  const reportUrl = URL.createObjectURL(reportBlob);
  window.open(reportUrl, "_blank");
};

const SIM_DURATION_MS = 60 * 1000;

const SimulationDashboard = () => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const intervalRef = useRef(null);
  const [aiLoading, setAiLoading] = useState(false);
  const simStartTimeRef = useRef(null);
  const [simSecondsLeft, setSimSecondsLeft] = useState(0);
  const [logHash, setLogHash] = useState(null);
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState("");
  const [workers, setWorkers] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [sensorReadings, setSensorReadings] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [carbonFootprint, setCarbonFootprint] = useState(0);

  const logMessage = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prevLogs) =>
      [`[${timestamp}] [${type.toUpperCase()}] ${message}`, ...prevLogs].slice(0, 100)
    );
  };

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data } = await axios.get("/sites");
        setSites(data.data);
        if (data.data.length > 0) {
          setSelectedSite(data.data[0]._id);
        }
      } catch (err) {
        setSites([]);
        logMessage("Error fetching sites.", "error");
      }
    };
    fetchSites();
  }, []);

  useEffect(() => {
    if (!selectedSite) return;
    const fetchSiteData = async () => {
      try {
        logMessage(`Fetching data for site ${selectedSite}...`);
        const res = await axios.get(`/sites/${selectedSite}`);
        const siteData = res.data.data;
        setWorkers((siteData.workers || []).map((w) => ({ ...w, fatigue: 0, status: "Active" })));
        setEquipments(siteData.equipments || []);
        setSensors(siteData.sensors || []);
        setSensorReadings([]);
        setIncidents([]);
        setCarbonFootprint(0);
        setLogHash(null);
        logMessage(`Loaded site data for "${siteData.name}"`, "success");
      } catch (err) {
        logMessage("Error fetching site data.", "error");
        setWorkers([]);
        setEquipments([]);
        setSensors([]);
      }
    };
    fetchSiteData();
  }, [selectedSite]);

  const runSimulationStep = useCallback(() => {
    logMessage("Running simulation step...");
    setWorkers((prevWorkers) =>
      prevWorkers.map((w) => {
        if (!w.currentLocation?.coordinates) return w;
        const newCoords = [
          w.currentLocation.coordinates[0] + (Math.random() - 0.5) * 0.0001,
          w.currentLocation.coordinates[1] + (Math.random() - 0.5) * 0.0001,
        ];
        const newPpeStatus = { ...w.ppeStatus };
        let newFatigue = w.fatigue || 0;
        let newStatus = w.status || "Active";
        const baseFatigueIncrease = 1;
        let fatigueMultiplier = 1;
        if (!newPpeStatus.helmet) fatigueMultiplier = 2;
        if (Math.random() > 0.7) fatigueMultiplier *= 1.5;
        newFatigue = Math.min(100, newFatigue + baseFatigueIncrease * fatigueMultiplier);

        if (newFatigue >= 80) {
          newStatus = "Critical Fatigue";
          if (w.status !== "Critical Fatigue") {
            const incident = {
              _id: `inc_${w._id}_${Date.now()}`,
              type: "FATIGUE_ALERT",
              description: `${w.fullname} has reached critical fatigue level.`,
              severity: "High",
              timestamp: new Date(),
              location: { coordinates: newCoords },
            };
            setIncidents((prev) => [incident, ...prev]);
            logMessage(`Fatigue Alert: ${incident.description}`, "critical");
            toast.error(`[${incident.severity}] ${incident.type}`);
          }
        } else if (newFatigue >= 60) newStatus = "High Fatigue";
        else if (newFatigue >= 40) newStatus = "Moderate Fatigue";
        else newStatus = "Active";

        if (Math.random() < 0.05 && newPpeStatus.helmet) {
          newPpeStatus.helmet = false;
          const incident = {
            _id: `inc_ppe_${w._id}_${Date.now()}`,
            type: "PPE_VIOLATION",
            description: `${w.fullname} detected without helmet.`,
            severity: "Medium",
            timestamp: new Date(),
            location: { coordinates: newCoords },
          };
          setIncidents((prev) => [incident, ...prev]);
          logMessage(`Generated Incident: ${incident.description}`, "warning");
          toast.warning(`[${incident.severity}] ${incident.type}`);
        } else if (!newPpeStatus.helmet && Math.random() < 0.3) {
          newPpeStatus.helmet = true;
        }

        return {
          ...w,
          currentLocation: { ...w.currentLocation, coordinates: newCoords },
          ppeStatus: newPpeStatus,
          fatigue: newFatigue,
          status: newStatus,
        };
      })
    );

    let currentEmissions = 0;
    const CO2_PER_LITER_DIESEL = 2.68;
    const CO2_PER_KWH_ELECTRICITY = 0.82;
    setEquipments((prevEquip) =>
      prevEquip.map((e) => {
        let newRuntimeHours = e.runtimeHours || 0;
        if (e.status === "Operational") {
          newRuntimeHours += 1 / 60;
          const emissionFactor = 2 / 3600;
          if (e.fuelType === "Diesel")
            currentEmissions += (e.consumptionRate || 0) * emissionFactor * CO2_PER_LITER_DIESEL;
          else if (e.fuelType === "Electric")
            currentEmissions += (e.consumptionRate || 0) * emissionFactor * CO2_PER_KWH_ELECTRICITY;
        }
        return { ...e, runtimeHours: newRuntimeHours };
      })
    );
    setCarbonFootprint((prev) => prev + currentEmissions);

    const newReadings = sensors.map((s) => {
      let reading;
      switch (s.type) {
        case "AirQuality":
          reading = { co: (Math.random() * 5).toFixed(2), no2: (Math.random() * 2).toFixed(2) };
          break;
        case "GasLeak":
          reading = { methane: (Math.random() * 0.5).toFixed(3) };
          if (reading.methane > 0.45) {
            const incident = {
              _id: `inc_gas_${s._id}_${Date.now()}`,
              type: "HAZARD_REPORT",
              description: `High methane detected by sensor ${s.name}.`,
              severity: "High",
              timestamp: new Date(),
            };
            setIncidents((prev) => [incident, ...prev]);
            logMessage(`Generated Incident: ${incident.description}`, "critical");
            toast.error(`[${incident.severity}] ${incident.type}`);
          }
          break;
        case "Temperature":
          reading = { value: (35 + Math.random() * 10).toFixed(2), unit: "°C" };
          break;
        default:
          reading = {};
      }
      return { sensorId: s._id, type: s.type, ...reading, timestamp: new Date() };
    });
    setSensorReadings((prev) => [...newReadings, ...prev].slice(0, 50));
  }, [sensors]);

  const handleCreateLog = async () => {
    const newLog = {
      logData: {
        message: "Simulation log saved.",
        details: logs.join("\n"),
      },
      logType: "Simulation",
      source: "Simulation Dashboard",
    };

    try {
      const { data } = await axios.post("/logs", newLog);
      const hash = data.data.blockchainTxHash;
      if (hash) {
        setLogHash(hash);
        toast.success("Log stored on blockchain successfully!");
        logMessage(`Log stored with hash: ${hash}`, "success");
      } else {
        toast.warn("Log saved to database, but failed to anchor to blockchain.");
        logMessage("Log saved to DB, but failed to send to blockchain.", "warning");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to create log.";
      logMessage(errorMessage, "error");
      toast.error(errorMessage);
      console.error("Failed to create log:", error);
    }
  };

  const getSensorChartData = () =>
    sensorReadings
      .filter((r) => r.type === "AirQuality")
      .slice(0, 10)
      .reverse()
      .map((d) => ({
        time: new Date(d.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        CO: parseFloat(d.co),
        NO2: parseFloat(d.no2),
      }));

  const getFatigueColor = (fatigue) => {
    if (fatigue >= 80) return "text-red-600 bg-red-50";
    if (fatigue >= 60) return "text-orange-600 bg-orange-50";
    if (fatigue >= 40) return "text-yellow-600 bg-yellow-50";
    return "text-green-600 bg-green-50";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Critical Fatigue":
        return "text-red-600 bg-red-100";
      case "High Fatigue":
        return "text-orange-600 bg-orange-100";
      case "Moderate Fatigue":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-green-600 bg-green-100";
    }
  };

  useEffect(() => {
    let timerId;
    if (simulationRunning) {
      setAiLoading(false);
      setLogHash(null);
      simStartTimeRef.current = Date.now();
      setSimSecondsLeft(Math.floor(SIM_DURATION_MS / 1000));
      logMessage("Simulation started.", "success");
      intervalRef.current = setInterval(runSimulationStep, 2000);
      timerId = setInterval(() => {
        const elapsed = Date.now() - simStartTimeRef.current;
        const left = Math.max(0, Math.ceil((SIM_DURATION_MS - elapsed) / 1000));
        setSimSecondsLeft(left);
        if (elapsed >= SIM_DURATION_MS) setSimulationRunning(false);
      }, 1000);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerId);
    };
  }, [simulationRunning, runSimulationStep]);

  // --- MODIFIED: On stop, generate and open report in new tab ---
  useEffect(() => {
    if (!simulationRunning && simStartTimeRef.current !== null) {
      logMessage("Simulation stopped. Generating analysis report...", "info");
      setAiLoading(true);
      toast.info("Generating Analysis Report...");

      try {
        const reportData = {
          workerData: workers,
          airQuality: getSensorChartData(),
          incidents: incidents.slice(0, 20),
          carbonFootprint: carbonFootprint,
        };

        displayAiReportInNewTab(reportData);

        logMessage("Analysis Report generated successfully.", "success");
        toast.success("Report has been opened in a new tab!");
      } catch (e) {
        logMessage("Failed to generate report.", "error");
        toast.error("Failed to generate report.");
        console.error(e);
      } finally {
        setAiLoading(false);
        simStartTimeRef.current = null;
      }
    }
  }, [simulationRunning, workers, logs, incidents, carbonFootprint]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-screen-2xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Mine Operations Simulation
            </h1>
            <div className="flex items-center gap-4">
              <select
                className="mr-4 px-3 py-2 border rounded text-base"
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                disabled={sites.length === 0 || simulationRunning}
              >
                {sites.map((site) => (
                  <option key={site._id} value={site._id}>
                    {site.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={() => setSimulationRunning(!simulationRunning)}
                variant={simulationRunning ? "destructive" : "default"}
                className={
                  !simulationRunning ? "bg-green-600 hover:bg-green-700 dark:text-white" : ""
                }
                disabled={!selectedSite || aiLoading}
              >
                {aiLoading
                  ? "Analyzing..."
                  : simulationRunning
                    ? "Stop Simulation"
                    : "Start Simulation"}
              </Button>
            </div>
          </div>
          {simulationRunning && (
            <div className="mb-3">
              <Alert className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-900">
                <Bot className="h-5 w-5 text-blue-400" />
                <AlertDescription>
                  <span className="font-semibold">Auto-stopping</span> in{" "}
                  <span className="font-mono font-bold">{simSecondsLeft}s</span>...
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* MAIN */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Monitoring Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <MapContainer
                    center={
                      sites.find((s) => s._id === selectedSite)?.location?.coordinates || [
                        23.74, 86.42,
                      ]
                    }
                    zoom={15}
                    style={{ height: "450px", width: "100%", borderRadius: "0.5rem" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"
                    />
                    {workers
                      .filter((w) => w.currentLocation && w.currentLocation.coordinates)
                      .map((w) => (
                        <Marker key={w._id} position={w.currentLocation.coordinates}>
                          <Popup>
                            <div>
                              <strong>{w.fullname}</strong> ({w.role}) <br />
                              Helmet: {w.ppeStatus && w.ppeStatus.helmet ? "✅" : "❌"} <br />
                              <span
                                className={`px-2 py-1 rounded text-xs ${getFatigueColor(w.fatigue || 0)}`}
                              >
                                Fatigue: {(w.fatigue || 0).toFixed(1)}%
                              </span>{" "}
                              <br />
                              Status:{" "}
                              <span
                                className={`px-2 py-1 rounded text-xs ${getStatusColor(w.status)}`}
                              >
                                {w.status}
                              </span>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    {equipments
                      .filter((e) => e.currentLocation && e.currentLocation.coordinates)
                      .map((e) => (
                        <Marker key={e._id} position={e.currentLocation.coordinates}>
                          <Popup>
                            {e.name} ({e.type}) <br /> Status: {e.status}
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5" /> Safety & Incident Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64 overflow-y-auto pr-2">
                  {incidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                      <ShieldAlert className="h-10 w-10 mb-2" />
                      <p>No incidents reported yet.</p>
                    </div>
                  ) : (
                    incidents.map((inc) => (
                      <Alert
                        key={inc._id}
                        variant={inc.severity === "High" ? "destructive" : "default"}
                        className="mb-3"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="font-bold">
                          [{inc.severity ? inc.severity.toUpperCase() : "INFO"}]{" "}
                          {inc.type.replace("_", " ")}
                        </AlertTitle>
                        <AlertDescription>
                          {inc.description} at {new Date(inc.timestamp).toLocaleString()}
                        </AlertDescription>
                      </Alert>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
            {/* SIDEBAR */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileTerminal className="h-5 w-5" /> Simulation Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-48 bg-slate-900 text-white font-mono text-xs p-3 rounded-md overflow-y-auto">
                  {logs.map((log, i) => (
                    <p
                      key={i}
                      className={
                        log.includes("[CRITICAL]")
                          ? "text-red-400"
                          : log.includes("[WARNING]")
                            ? "text-yellow-400"
                            : log.includes("[SUCCESS]")
                              ? "text-green-400"
                              : "text-slate-300"
                      }
                    >
                      {log}
                    </p>
                  ))}
                </CardContent>
                {!simulationRunning && logs.length > 0 && (
                  <div className="p-4 border-t">
                    <Button onClick={handleCreateLog} className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Store Log on Blockchain
                    </Button>
                    {logHash && (
                      <div className="mt-4 p-2 bg-slate-100 rounded-md">
                        <p className="text-xs font-semibold text-slate-700">Blockchain Tx Hash:</p>
                        <p className="text-xs text-slate-500 break-all">{logHash}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Footprint Estimation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                    {carbonFootprint.toFixed(2)} kg CO₂
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Total emissions since simulation start.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Sensor Data (Air Quality)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                      data={getSensorChartData()}
                      margin={{ top: 24, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="time" stroke="hsl(var(--primary))" fontSize={12} />
                      <YAxis stroke="hsl(var(--primary))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="CO" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="NO2" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Worker Status Table */}
          {workers.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Worker Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Worker Name</th>
                          <th className="text-left p-2">Role</th>
                          <th className="text-left p-2">PPE Status</th>
                          <th className="text-left p-2">Fatigue Level</th>
                          <th className="text-left p-2">Current Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workers.map((worker) => (
                          <tr key={worker._id} className="border-b hover:bg-slate-50">
                            <td className="p-2 font-medium">{worker.fullname}</td>
                            <td className="p-2">{worker.role}</td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-2 h-2 rounded-full ${worker.ppeStatus?.helmet ? "bg-green-500" : "bg-red-500"}`}
                                ></span>
                                Helmet: {worker.ppeStatus?.helmet ? "✅" : "❌"}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <Battery
                                  className={`h-4 w-4 ${(worker.fatigue || 0) >= 80 ? "text-red-500" : (worker.fatigue || 0) >= 60 ? "text-orange-500" : (worker.fatigue || 0) >= 40 ? "text-yellow-500" : "text-green-500"}`}
                                />
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${getFatigueColor(worker.fatigue || 0)}`}
                                >
                                  {(worker.fatigue || 0).toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(worker.status)}`}
                              >
                                {worker.status || "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default SimulationDashboard;
