import React, { useState, useEffect, useCallback } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  serverTimestamp,
  enableIndexedDbPersistence,
} from "firebase/firestore";

// Your specific Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmkp5UpHj5iWf8au4j8U1MYv-DYx5jFhY",
  authDomain: "nfc-4-a64aa.firebaseapp.com",
  projectId: "nfc-4-a64aa", // Using projectId for the appId in Firestore paths
  storageBucket: "nfc-4-a64aa.firebasestorage.app",
  messagingSenderId: "257578849540",
  appId: "1:257578849540:web:734e85c3f8b4b8c538ec51",
  measurementId: "G-6VTZJYPQBX",
};

// Define appId using the projectId from your firebaseConfig
const appId = firebaseConfig.projectId;

// Utility function to convert PCM audio to WAV format (kept for completeness, though not directly used in this version)
function pcmToWav(pcmData, sampleRate) {
  const numChannels = 1; // Assuming mono audio
  const bytesPerSample = 2; // 16-bit PCM

  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF chunk
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcmData.byteLength, true); // ChunkSize
  writeString(view, 8, "WAVE");

  // FMT sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // ByteRate
  view.setUint16(32, numChannels * bytesPerSample, true); // BlockAlign
  view.setUint16(34, bytesPerSample * 8, true); // BitsPerSample

  // DATA sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, pcmData.byteLength, true); // Subchunk2Size

  const combined = new Uint8Array(wavHeader.byteLength + pcmData.byteLength);
  combined.set(new Uint8Array(wavHeader), 0);
  combined.set(new Uint8Array(pcmData.buffer), wavHeader.byteLength);

  return new Blob([combined], { type: "audio/wav" });
}

function writeString(view, offset, str) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Exponential backoff for API calls
const callApiWithBackoff = async (apiCall, maxRetries = 5, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await apiCall();
      if (!response.ok) {
        if (response.status === 429 || response.status >= 500) {
          // Too Many Requests or Server Error
          throw new Error(`API call failed with status ${response.status}. Retrying...`);
        }
      }
      return response;
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      } else {
        throw error; // Re-throw if max retries reached
      }
    }
  }
};

function MineOpsDashboard({ userId, handleLogout }) {
  // Accept userId and handleLogout as props
  const [db, setDb] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  // State for Dashboard
  const [workers, setWorkers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [envSensors, setEnvSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // State for R&D Projects
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "",
    budget: "",
    timeline: "",
    status: "Planning",
    outcomes: "",
  });

  // State for Carbon Footprint
  const [fuelConsumption, setFuelConsumption] = useState(0);
  const [materialLogistics, setMaterialLogistics] = useState(0);
  const [estimatedEmissions, setEstimatedEmissions] = useState(0);
  const [carbonAlternatives, setCarbonAlternatives] = useState([]);

  // State for Worker App
  const [incidentReport, setIncidentReport] = useState({
    type: "",
    description: "",
    location: "",
  });
  const [incidents, setIncidents] = useState([]);

  // State for AI Simulation
  const [simulationIntervalId, setSimulationIntervalId] = useState(null);

  // Initialize Firebase (Firestore only)
  useEffect(() => {
    const setupFirebase = async () => {
      let app;
      // Check if a Firebase app is already initialized
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp(); // Get the default app if it already exists
      }

      const dbInstance = getFirestore(app);

      try {
        // Attempt to enable persistence immediately after getting the Firestore instance
        await enableIndexedDbPersistence(dbInstance);
        console.log("Firestore offline persistence enabled successfully.");
      } catch (err) {
        if (err.code === "failed-precondition") {
          console.warn(
            "Firestore persistence failed: Multiple tabs open or another app is using IndexedDB."
          );
        } else if (err.code === "unimplemented") {
          console.warn("Firestore persistence failed: Browser does not support IndexedDB.");
        } else {
          console.error("Firestore persistence failed:", err);
        }
      } finally {
        setDb(dbInstance); // Set db state only after persistence attempt
        setLoading(false); // Set loading to false after Firebase init attempt
      }
    };

    setupFirebase();

    // Add event listeners for online/offline status
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array, so it runs once on mount.

  // Fetch data when userId and db are ready
  useEffect(() => {
    if (!db || !userId) return;

    // Fetch Workers
    const workersRef = collection(db, `artifacts/${appId}/users/${userId}/workers`);
    const unsubscribeWorkers = onSnapshot(
      workersRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkers(data);
      },
      (err) => console.error("Error fetching workers:", err)
    );

    // Fetch Machines
    const machinesRef = collection(db, `artifacts/${appId}/users/${userId}/machines`);
    const unsubscribeMachines = onSnapshot(
      machinesRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMachines(data);
      },
      (err) => console.error("Error fetching machines:", err)
    );

    // Fetch Environmental Sensors
    const envSensorsRef = collection(db, `artifacts/${appId}/users/${userId}/env_sensors`);
    const unsubscribeEnvSensors = onSnapshot(
      envSensorsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEnvSensors(data);
      },
      (err) => console.error("Error fetching environmental sensors:", err)
    );

    // Fetch Alerts
    const alertsRef = collection(db, `artifacts/${appId}/users/${userId}/alerts`);
    const unsubscribeAlerts = onSnapshot(
      alertsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlerts(data);
      },
      (err) => console.error("Error fetching alerts:", err)
    );

    // Fetch R&D Projects
    const projectsRef = collection(db, `artifacts/${appId}/users/${userId}/projects`);
    const unsubscribeProjects = onSnapshot(
      projectsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(data);
      },
      (err) => console.error("Error fetching projects:", err)
    );

    // Fetch Incidents
    const incidentsRef = collection(db, `artifacts/${appId}/users/${userId}/incidents`);
    const unsubscribeIncidents = onSnapshot(
      incidentsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIncidents(data);
      },
      (err) => console.error("Error fetching incidents:", err)
    );

    return () => {
      unsubscribeWorkers();
      unsubscribeMachines();
      unsubscribeEnvSensors();
      unsubscribeAlerts();
      unsubscribeProjects();
      unsubscribeIncidents();
    };
  }, [db, userId]); // userId is now a prop

  // Agentic AI Simulation for Real-time Monitoring and Alerts
  const simulateMonitoring = useCallback(async () => {
    if (!db || !userId) return;

    console.log("Running simulation...");

    // Simulate Worker Location
    const workerId = "worker_123";
    const workerRef = doc(db, `artifacts/${appId}/users/${userId}/workers`, workerId);
    const workerData = {
      id: workerId,
      name: "John Doe",
      location: `Zone ${Math.floor(Math.random() * 5) + 1}`,
      status: Math.random() > 0.1 ? "Active" : "Idle",
      heartRate: Math.random() * 40 + 60, // 60-100 bpm
      protectiveEquipment: Math.random() > 0.05, // 5% chance of missing equipment
      lastUpdate: serverTimestamp(),
    };
    await setDoc(workerRef, workerData, { merge: true });

    // Simulate Environmental Sensor Data (Gas Leak, Air Quality)
    const sensorId = "sensor_A1";
    const sensorRef = doc(db, `artifacts/${appId}/users/${userId}/env_sensors`, sensorId);
    const gasLevel = Math.random() * 100; // 0-100 ppm
    const airQuality = Math.random() * 50 + 50; // 50-100 AQI
    const envData = {
      id: sensorId,
      location: "Main Shaft",
      gasLevel: gasLevel.toFixed(2),
      airQuality: airQuality.toFixed(2),
      lastUpdate: serverTimestamp(),
    };
    await setDoc(sensorRef, envData, { merge: true });

    // Simulate Machinery Status
    const machineId = "excavator_001";
    const machineRef = doc(db, `artifacts/${appId}/users/${userId}/machines`, machineId);
    const machineStatus = Math.random() > 0.2 ? "Operating" : "Maintenance Needed";
    const machineFuel = Math.random() * 50 + 20; // 20-70% fuel
    const machineData = {
      id: machineId,
      name: "Heavy Excavator",
      status: machineStatus,
      fuelLevel: machineFuel.toFixed(2),
      lastUpdate: serverTimestamp(),
    };
    await setDoc(machineRef, machineData, { merge: true });

    // AI-generated Safety Alerts based on simulated data
    const alertsRef = collection(db, `artifacts/${appId}/users/${userId}/alerts`);

    let prompt = `Simulate a coal mine monitoring system. Based on the following data, generate a concise safety alert message if there's a critical issue, otherwise state 'No critical alerts'.
        Worker: ${workerData.name}, Location: ${workerData.location}, Status: ${workerData.status}, Heart Rate: ${workerData.heartRate} bpm, Has Protective Equipment: ${workerData.protectiveEquipment}.
        Environmental Sensor: Location: ${envData.location}, Gas Level: ${envData.gasLevel} ppm, Air Quality: ${envData.airQuality} AQI.
        Machinery: ${machineData.name}, Status: ${machineData.status}, Fuel Level: ${machineData.fuelLevel}%.

        Critical thresholds:
        - Gas Level > 70 ppm
        - Worker Heart Rate > 95 bpm
        - Worker missing protective equipment
        - Machinery needs maintenance
        `;

    if (
      gasLevel > 70 ||
      workerData.heartRate > 95 ||
      !workerData.protectiveEquipment ||
      machineStatus === "Maintenance Needed"
    ) {
      prompt += `\n\nGenerate an alert message.`;
    } else {
      prompt = `Given the following coal mine data, generate a brief status update. If there are no critical issues, state 'All systems normal'.
            Worker: ${workerData.name}, Location: ${workerData.location}, Status: ${workerData.status}, Heart Rate: ${workerData.heartRate} bpm, Has Protective Equipment: ${workerData.protectiveEquipment}.
            Environmental Sensor: Location: ${envData.location}, Gas Level: ${envData.gasLevel} ppm, Air Quality: ${envData.airQuality} AQI.
            Machinery: ${machineData.name}, Status: ${machineData.status}, Fuel Level: ${machineData.fuelLevel}%.`;
    }

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      };
      const apiKey = ""; // Canvas will provide this at runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await callApiWithBackoff(() =>
        fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );

      const result = await response.json();
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        if (
          text &&
          text.toLowerCase() !== "no critical alerts" &&
          text.toLowerCase() !== "all systems normal"
        ) {
          await addDoc(alertsRef, {
            message: text,
            timestamp: serverTimestamp(),
            type: "safety",
            resolved: false,
          });
        }
      } else {
        console.warn("Gemini API response structure unexpected:", result);
      }
    } catch (apiError) {
      console.error("Error generating AI alert:", apiError);
    }

    // Simulate Carbon Emissions Calculation
    const simulatedFuel = Math.random() * 1000; // Liters
    const simulatedMaterial = Math.random() * 500; // Tons
    const emissionFactorFuel = 2.3; // kg CO2 per liter of diesel
    const emissionFactorMaterial = 0.5; // kg CO2 per ton of material logistics

    const calculatedEmissions =
      simulatedFuel * emissionFactorFuel + simulatedMaterial * emissionFactorMaterial;
    setEstimatedEmissions(calculatedEmissions);

    const carbonRef = doc(db, `artifacts/${appId}/users/${userId}/carbon_data`, "current");
    await setDoc(
      carbonRef,
      {
        fuelConsumption: simulatedFuel,
        materialLogistics: simulatedMaterial,
        estimatedEmissions: calculatedEmissions,
        lastUpdate: serverTimestamp(),
      },
      { merge: true }
    );

    // Simulate Carbon Neutrality Suggestions (simple logic)
    if (calculatedEmissions > 1000) {
      setCarbonAlternatives([
        "Implement bio-reclamation in unused mining areas.",
        "Transition 20% of heavy machinery to cleaner fuels (e.g., electric, hydrogen).",
        "Invest in carbon capture technologies.",
        "Optimize logistics routes to reduce fuel consumption.",
      ]);
    } else {
      setCarbonAlternatives([
        "Maintain current practices, consider minor optimizations.",
        "Explore renewable energy sources for site operations.",
      ]);
    }
  }, [db, userId]);

  // Start/Stop Simulation
  useEffect(() => {
    if (!db || !userId) {
      // Ensure db is initialized before starting simulation
      if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
        setSimulationIntervalId(null);
      }
      return;
    }

    if (!simulationIntervalId) {
      // Start simulation immediately and then every 15 seconds
      simulateMonitoring();
      const interval = setInterval(simulateMonitoring, 15000);
      setSimulationIntervalId(interval);
    }

    return () => {
      if (simulationIntervalId) {
        clearInterval(simulationIntervalId);
      }
    };
  }, [db, userId, simulateMonitoring]); // Added db to dependencies to ensure it's ready

  // R&D Project Handlers
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const addProject = async () => {
    if (!db || !userId) return;
    try {
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/projects`), {
        ...newProject,
        budget: parseFloat(newProject.budget),
        createdAt: serverTimestamp(),
      });
      setNewProject({
        name: "",
        budget: "",
        timeline: "",
        status: "Planning",
        outcomes: "",
      });
    } catch (e) {
      console.error("Error adding project: ", e);
      setError("Failed to add project.");
    }
  };

  // Worker App Incident Reporting
  const handleIncidentChange = (e) => {
    const { name, value } = e.target;
    setIncidentReport((prev) => ({ ...prev, [name]: value }));
  };

  const submitIncident = async () => {
    if (!db || !userId) return;
    try {
      await addDoc(collection(db, `artifacts/${appId}/users/${userId}/incidents`), {
        ...incidentReport,
        reportedBy: userId,
        timestamp: serverTimestamp(),
        resolved: false,
      });
      setIncidentReport({ type: "", description: "", location: "" });
      // Using a custom modal/message box instead of alert()
      const messageBox = document.createElement("div");
      messageBox.className =
        "fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50";
      messageBox.innerHTML = `
                <div class="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 text-white text-center">
                    <p class="text-xl font-semibold mb-4">Incident Reported Successfully!</p>
                    <button id="closeMessageBox" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Close</button>
                </div>
            `;
      document.body.appendChild(messageBox);
      document.getElementById("closeMessageBox").onclick = () => {
        document.body.removeChild(messageBox);
      };
    } catch (e) {
      console.error("Error reporting incident: ", e);
      setError("Failed to report incident.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-xl font-semibold">Initializing Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-900 text-white">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-inter flex flex-col">
      <style>
        {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                body { font-family: 'Inter', sans-serif; }
                /* Custom scrollbar for better aesthetics */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #2d3748; /* Darker gray for track */
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: #4a5568; /* Medium gray for thumb */
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #6b7280; /* Lighter gray on hover */
                }
                `}
      </style>
      <header className="bg-gray-800 p-4 shadow-md flex justify-between items-center rounded-b-lg">
        <h1 className="text-2xl font-bold text-blue-400">MineOps Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              onlineStatus ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {onlineStatus ? "Online" : "Offline"}
          </span>
          <nav>
            <ul className="flex space-x-4">
              {["dashboard", "rnd", "carbon", "safety", "worker-app"].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {tab
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <button
            onClick={handleLogout} // Use the handleLogout prop
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-grow p-6">
        <div className="text-sm text-gray-400 mb-4">
          Your User ID: <span className="font-mono text-blue-300 break-all">{userId}</span>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Worker Monitoring</h2>
              {workers.length > 0 ? (
                <ul>
                  {workers.map((worker) => (
                    <li
                      key={worker.id}
                      className="mb-2 p-3 bg-gray-700 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-200">{worker.name}</p>
                        <p className="text-sm text-gray-400">Location: {worker.location}</p>
                        <p className="text-sm text-gray-400">
                          Status:{" "}
                          <span
                            className={
                              worker.status === "Active" ? "text-green-400" : "text-yellow-400"
                            }
                          >
                            {worker.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Heart Rate: {worker.heartRate?.toFixed(0)} bpm
                        </p>
                        <p className="text-sm text-gray-400">
                          PPE: {worker.protectiveEquipment ? "Yes" : "No"}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {worker.lastUpdate?.toDate
                          ? new Date(worker.lastUpdate.toDate()).toLocaleTimeString()
                          : "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No worker data available.</p>
              )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Machinery Status</h2>
              {machines.length > 0 ? (
                <ul>
                  {machines.map((machine) => (
                    <li
                      key={machine.id}
                      className="mb-2 p-3 bg-gray-700 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-200">{machine.name}</p>
                        <p className="text-sm text-gray-400">
                          Status:{" "}
                          <span
                            className={
                              machine.status === "Operating" ? "text-green-400" : "text-red-400"
                            }
                          >
                            {machine.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">Fuel Level: {machine.fuelLevel}%</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {machine.lastUpdate?.toDate
                          ? new Date(machine.lastUpdate.toDate()).toLocaleTimeString()
                          : "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No machinery data available.</p>
              )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Environmental Sensors</h2>
              {envSensors.length > 0 ? (
                <ul>
                  {envSensors.map((sensor) => (
                    <li
                      key={sensor.id}
                      className="mb-2 p-3 bg-gray-700 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium text-gray-200">{sensor.location}</p>
                        <p className="text-sm text-gray-400">
                          Gas Level:{" "}
                          <span
                            className={
                              parseFloat(sensor.gasLevel) > 70 ? "text-red-400" : "text-green-400"
                            }
                          >
                            {sensor.gasLevel} ppm
                          </span>
                        </p>
                        <p className="text-sm text-gray-400">
                          Air Quality: {sensor.airQuality} AQI
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {sensor.lastUpdate?.toDate
                          ? new Date(sensor.lastUpdate.toDate()).toLocaleTimeString()
                          : "N/A"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No environmental sensor data available.</p>
              )}
            </div>
          </div>
        )}

        {/* Safety Protocol Alerts Tab */}
        {activeTab === "safety" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Safety Protocol Alerts (AI-Generated)
            </h2>
            {alerts.length > 0 ? (
              <ul className="space-y-3">
                {alerts.map((alert) => (
                  <li
                    key={alert.id}
                    className={`p-4 rounded-md flex justify-between items-start ${
                      alert.resolved ? "bg-green-700" : "bg-red-700"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-lg text-white">{alert.message}</p>
                      <p className="text-sm text-gray-200 mt-1">
                        <span className="font-semibold">Type:</span> {alert.type} |{" "}
                        <span className="font-semibold">Time:</span>{" "}
                        {alert.timestamp?.toDate
                          ? new Date(alert.timestamp.toDate()).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button
                        onClick={async () => {
                          try {
                            await updateDoc(
                              doc(db, `artifacts/${appId}/users/${userId}/alerts`, alert.id),
                              { resolved: true }
                            );
                          } catch (e) {
                            console.error("Error resolving alert:", e);
                            setError("Failed to resolve alert.");
                          }
                        }}
                        className="ml-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No safety alerts at the moment. All clear!</p>
            )}
          </div>
        )}

        {/* R&D Projects Tab */}
        {activeTab === "rnd" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Digital Management of R&D/S&T Projects
            </h2>
            <div className="mb-6 p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-medium mb-3 text-gray-200">Add New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={handleProjectChange}
                  className="p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="budget"
                  placeholder="Budget (USD)"
                  value={newProject.budget}
                  onChange={handleProjectChange}
                  className="p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="timeline"
                  placeholder="Timeline (e.g., Q4 2023 - Q2 2024)"
                  value={newProject.timeline}
                  onChange={handleProjectChange}
                  className="p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="status"
                  value={newProject.status}
                  onChange={handleProjectChange}
                  className="p-2 rounded-md bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <textarea
                  name="outcomes"
                  placeholder="Expected Outcomes"
                  value={newProject.outcomes}
                  onChange={handleProjectChange}
                  rows="2"
                  className="p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-full"
                ></textarea>
              </div>
              <button
                onClick={addProject}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                Add Project
              </button>
            </div>

            <h3 className="text-lg font-medium mb-3 text-gray-200">Current Projects</h3>
            {projects.length > 0 ? (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className="p-4 bg-gray-700 rounded-md shadow-sm border border-gray-600"
                  >
                    <p className="font-bold text-lg text-blue-300">{project.name}</p>
                    <p className="text-sm text-gray-300">
                      Budget: ${project.budget?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-300">Timeline: {project.timeline}</p>
                    <p className="text-sm text-gray-300">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          project.status === "Completed"
                            ? "text-green-400"
                            : project.status === "In Progress"
                              ? "text-yellow-400"
                              : "text-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-300">Outcomes: {project.outcomes}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No R&D projects tracked yet.</p>
            )}
          </div>
        )}

        {/* Carbon Footprint Tab */}
        {activeTab === "carbon" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Carbon Footprint Estimation & Neutrality Simulator
            </h2>
            <div className="mb-6 p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-medium mb-3 text-gray-200">Current Carbon Metrics</h3>
              <p className="text-gray-300 mb-2">
                Fuel Consumption (simulated):{" "}
                <span className="font-semibold">{fuelConsumption.toFixed(2)} Liters</span>
              </p>
              <p className="text-gray-300 mb-2">
                Material Logistics (simulated):{" "}
                <span className="font-semibold">{materialLogistics.toFixed(2)} Tons</span>
              </p>
              <p className="text-xl text-white font-bold mt-4">
                Estimated CO2 Emissions:{" "}
                <span className="text-green-400">{estimatedEmissions.toFixed(2)} kg CO2</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                (Auto-calculated based on simulated equipment usage, fuel, and material logistics.
                Values update every 15 seconds.)
              </p>
            </div>

            <div className="p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-medium mb-3 text-gray-200">
                Carbon Neutrality Suggestions
              </h3>
              {carbonAlternatives.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {carbonAlternatives.map((alt, index) => (
                    <li key={index}>{alt}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">
                  No suggestions available. Run simulation to get insights.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Worker App Tab */}
        {activeTab === "worker-app" && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">
              Worker Mobile Interface: Incident Reporting
            </h2>
            <div className="mb-6 p-4 bg-gray-700 rounded-md">
              <h3 className="text-lg font-medium mb-3 text-gray-200">
                Report an Incident / Hazard
              </h3>
              <div className="space-y-4">
                <select
                  name="type"
                  value={incidentReport.type}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Incident Type</option>
                  <option value="Near Miss">Near Miss</option>
                  <option value="Equipment Malfunction">Equipment Malfunction</option>
                  <option value="Environmental Hazard">Environmental Hazard</option>
                  <option value="Safety Violation">Safety Violation</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  name="location"
                  placeholder="Location (e.g., Zone 3, Main Tunnel)"
                  value={incidentReport.location}
                  onChange={handleIncidentChange}
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="description"
                  placeholder="Detailed Description of Incident"
                  value={incidentReport.description}
                  onChange={handleIncidentChange}
                  rows="4"
                  className="w-full p-2 rounded-md bg-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                onClick={submitIncident}
                className="mt-4 w-full px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                Submit Report
              </button>
            </div>

            <h3 className="text-lg font-medium mb-3 text-gray-200">Recent Incidents Reported</h3>
            {incidents.length > 0 ? (
              <ul className="space-y-3">
                {incidents.map((incident) => (
                  <li
                    key={incident.id}
                    className="p-3 bg-gray-700 rounded-md shadow-sm border border-gray-600"
                  >
                    <p className="font-bold text-gray-200">
                      {incident.type} - {incident.location}
                    </p>
                    <p className="text-sm text-gray-300">{incident.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Reported:{" "}
                      {incident.timestamp?.toDate
                        ? new Date(incident.timestamp.toDate()).toLocaleString()
                        : "N/A"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No incidents reported recently.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default MineOpsDashboard;
