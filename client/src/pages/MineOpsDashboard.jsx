import React, { useState, useEffect, useCallback } from "react";
import axios from "@/lib/axios";
import { Toaster, toast } from "sonner";
import { useAuth } from "../context/AuthContext";

// Shadcn UI & Icon Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, User, MapPin, Zap, Shield, Cog, CheckCircle } from "lucide-react";

// --- Static Data Fallbacks ---
const staticWorker = {
  _id: "worker_offline_1",
  fullname: "Static Worker",
  role: "Miner",
  currentLocation: { coordinates: [23.74, 86.42], type: "Point" },
  status: "Active",
  fatigue: 20,
  assignedEquipment: [
    {
      _id: "machine_offline_1",
      name: "Static Excavator",
      status: "Operational",
      fuelLevel: 80,
    },
  ],
};
const staticAlerts = [
  { _id: "alert_offline_1", message: "STATIC: High gas level detected!", resolved: false },
];
const staticIncidents = [
  {
    _id: "incident_offline_1",
    type: "NEAR_MISS",
    description: "STATIC: Near miss with falling debris.",
    status: "Reported",
    timestamp: new Date().toISOString(),
  },
];

// --- Local Storage Keys for Caching ---
const PENDING_WRITES_KEY = "pending_worker_writes";
const CACHE_WORKER_KEY = "cached_worker_data";
const CACHE_ALERTS_KEY = "cached_alerts_data";
const CACHE_INCIDENTS_KEY = "cached_incidents_data";

// Exponential backoff for API calls
const callApiWithBackoff = async (apiCall, maxRetries = 5, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (error.response && (error.response.status === 429 || error.response.status >= 500)) {
        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }
};

function WorkerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [worker, setWorker] = useState(null);
  const [machines, setMachines] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);

  const [alertReport, setAlertReport] = useState({ recipient: "", message: "", severity: "low" });
  const [incidentReport, setIncidentReport] = useState({
    site: "",
    type: "",
    severity: "Medium",
    description: "",
    location: { type: "Point", coordinates: [] },
  });

  const userId = user?._id;

  const loadFromCache = useCallback(() => {
    try {
      const cachedWorker = localStorage.getItem(CACHE_WORKER_KEY);
      if (cachedWorker) {
        const parsed = JSON.parse(cachedWorker);
        setWorker(parsed);
        setMachines(parsed.assignedEquipment || []);
      }
      const cachedAlerts = localStorage.getItem(CACHE_ALERTS_KEY);
      if (cachedAlerts) setAlerts(JSON.parse(cachedAlerts));
      const cachedIncidents = localStorage.getItem(CACHE_INCIDENTS_KEY);
      if (cachedIncidents) setIncidents(JSON.parse(cachedIncidents));
    } catch (e) {
      console.error("Failed to load from cache, using static fallbacks.", e);
      setWorker(staticWorker);
      setMachines(staticWorker.assignedEquipment);
      setAlerts(staticAlerts);
      setIncidents(staticIncidents);
    }
  }, []);

  const saveToCache = useCallback((workerData, alertsData, incidentsData) => {
    try {
      if (workerData) localStorage.setItem(CACHE_WORKER_KEY, JSON.stringify(workerData));
      if (alertsData) localStorage.setItem(CACHE_ALERTS_KEY, JSON.stringify(alertsData));
      if (incidentsData) localStorage.setItem(CACHE_INCIDENTS_KEY, JSON.stringify(incidentsData));
    } catch (e) {
      console.error("Failed to save to cache:", e);
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!userId || !navigator.onLine) {
      console.log("User ID missing or offline, skipping live data fetch.");
      return;
    }
    try {
      const [workerRes, alertsRes, incidentsRes] = await Promise.all([
        callApiWithBackoff(() => axios.get(`/users/profile/${userId}`)),
        callApiWithBackoff(() => axios.get(`/alerts/user/${userId}`)),
        callApiWithBackoff(() => axios.get(`/incidents/user/${userId}`)),
      ]);

      const workerData = workerRes.data.data;
      const alertsData = alertsRes.data.data || [];
      const incidentsData = incidentsRes.data.data || [];

      setWorker(workerData);
      setMachines(workerData.assignedEquipment || []);
      setAlerts(alertsData);
      setIncidents(incidentsData);
      saveToCache(workerData, alertsData, incidentsData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch live data:", err);
      setError("Could not fetch live data. Displaying cached data.");
    }
  }, [userId, saveToCache]);

  const processPendingWrites = useCallback(async () => {
    if (!navigator.onLine) return;
    let pendingWrites = JSON.parse(localStorage.getItem(PENDING_WRITES_KEY) || "[]");
    if (pendingWrites.length === 0) return;

    toast.info(`Syncing ${pendingWrites.length} offline change(s)...`);
    const successfulWriteIds = new Set();
    for (const write of pendingWrites) {
      try {
        const response = await callApiWithBackoff(() =>
          axios({ method: write.method, url: write.url, data: write.body })
        );
        if (response.status >= 200 && response.status < 300) {
          successfulWriteIds.add(write.id);
        }
      } catch (err) {
        console.error(`Error during sync for ${write.url}:`, err);
      }
    }

    const remainingWrites = pendingWrites.filter((pw) => !successfulWriteIds.has(pw.id));
    localStorage.setItem(PENDING_WRITES_KEY, JSON.stringify(remainingWrites));

    if (remainingWrites.length === 0) {
      toast.success("All offline changes have been synced.");
    } else {
      toast.warning(`${remainingWrites.length} changes could not be synced.`);
    }
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user._id) {
      setError("Authentication error. Please log in.");
      setLoading(false);
      return;
    }
    loadFromCache();
    setLoading(false);
    if (navigator.onLine) {
      processPendingWrites().then(() => fetchData());
    }
    const handleStatusChange = () => {
      const isOnline = navigator.onLine;
      setOnlineStatus(isOnline);
      if (isOnline) {
        toast.info("Connection restored. Syncing changes...");
        processPendingWrites();
      } else {
        toast.warning("You are now offline. Changes will be saved locally.");
      }
    };
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);
    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, [authLoading, user, fetchData, loadFromCache, processPendingWrites]);

  const queueWrite = (url, method, body) => {
    const pendingWrites = JSON.parse(localStorage.getItem(PENDING_WRITES_KEY) || "[]");
    pendingWrites.push({ id: Date.now(), url, method, body });
    localStorage.setItem(PENDING_WRITES_KEY, JSON.stringify(pendingWrites));
  };

  const submitAlert = () => {
    if (!alertReport.recipient || !alertReport.message) {
      toast.error("Recipient and message are required.");
      return;
    }
    queueWrite(`/alerts`, "POST", { ...alertReport, reportedBy: userId });
    toast.success("Alert has been queued for sending.");
    setAlertReport({ recipient: "", message: "", severity: "low" });
  };

  const submitIncident = () => {
    if (
      !incidentReport.site ||
      !incidentReport.type ||
      !incidentReport.description ||
      incidentReport.location.coordinates.length !== 2
    ) {
      toast.error("Please fill all required incident fields.");
      return;
    }
    const incidentData = {
      ...incidentReport,
      reportedBy: userId,
      timestamp: new Date().toISOString(),
    };
    queueWrite(`/incidents`, "POST", incidentData);
    setIncidents((prev) => [...prev, { ...incidentData, _id: `temp_${Date.now()}` }]);
    toast.success("Incident report saved and queued for sync.");
    setIncidentReport({
      site: "",
      type: "",
      severity: "Medium",
      description: "",
      location: { type: "Point", coordinates: [] },
    });
  };

  const updateMachineStatus = (machineId, currentStatus) => {
    const newStatus = currentStatus === "Operational" ? "Maintenance" : "Operational";
    const updateData = { status: newStatus, lastUpdate: new Date().toISOString() };
    setMachines((prev) => prev.map((m) => (m._id === machineId ? { ...m, status: newStatus } : m)));
    queueWrite(`/equipment/${machineId}`, "PATCH", updateData);
    toast.success(`Machine status update for '${newStatus}' queued.`);
  };

  const updateIncidentStatus = (incidentId, currentStatus) => {
    if (currentStatus === "Resolved") return;
    const updateData = { status: "Resolved", resolutionNotes: "Marked as resolved by worker." };
    setIncidents((prev) =>
      prev.map((inc) => (inc._id === incidentId ? { ...inc, status: "Resolved" } : inc))
    );
    queueWrite(`/incidents/${incidentId}`, "PATCH", updateData);
    toast.success("Incident resolution queued for sync.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">Loading Dashboard...</div>
    );
  }

  if (error && !worker) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <Toaster richColors position="bottom-center" />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Worker Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Logged in as: {worker?.fullname || "..."} ({userId})
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Badge variant={onlineStatus ? "default" : "destructive"}>
              {onlineStatus ? "Online" : "Offline"}
            </Badge>
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {["dashboard", "my-equipment", "safety", "carbon"].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  variant={activeTab === tab ? "default" : "ghost"}
                  className={`capitalize text-sm h-8 ${activeTab === tab ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}`}
                >
                  {tab.replace("-", " ")}
                </Button>
              ))}
            </nav>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Network Warning</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-500" /> Role:{" "}
                  <span className="font-semibold ml-2">{worker?.role}</span>
                </p>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" /> Location:{" "}
                  <span className="font-semibold ml-2">
                    {worker?.currentLocation?.coordinates?.join(", ")}
                  </span>
                </p>
                <p className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-gray-500" /> Status:{" "}
                  <Badge variant={worker?.status === "Active" ? "secondary" : "destructive"}>
                    {worker?.status}
                  </Badge>
                </p>
                <p className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-gray-500" /> Fatigue:{" "}
                  <span className="font-semibold ml-2">{worker?.fatigue}%</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Assigned Equipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {machines.length > 0 ? (
                  machines.map((m) => (
                    <div
                      key={m._id}
                      className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md border"
                    >
                      <div>
                        <p className="font-semibold">{m.name}</p>
                        <Badge variant={m.status === "Operational" ? "default" : "destructive"}>
                          {m.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => updateMachineStatus(m._id, m.status)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Toggle
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No equipment assigned.</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>My Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.length > 0 ? (
                  alerts.map((a) => (
                    <Alert key={a._id} variant={a.resolved ? "default" : "destructive"}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">{a.message}</AlertDescription>
                    </Alert>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No new alerts.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "my-equipment" && (
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Equipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {machines.length > 0 ? (
                machines.map((m) => (
                  <div
                    key={m._id}
                    className="p-4 bg-gray-50 rounded-lg border flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div>
                      <p className="font-bold text-lg">{m.name}</p>
                      <p className="text-sm text-gray-600">Type: {m.type || "N/A"}</p>
                      <p className="text-sm text-gray-600">Fuel: {m.fuelLevel}%</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <Badge
                        variant={m.status === "Operational" ? "default" : "destructive"}
                        className="mb-2"
                      >
                        {m.status}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => updateMachineStatus(m._id, m.status)}
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Toggle Status
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No equipment assigned.</p>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "safety" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Report</CardTitle>
                <CardDescription>File an alert or incident report.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-800">Send an Urgent Alert</h4>
                  <Input
                    placeholder="Recipient User ID"
                    value={alertReport.recipient}
                    onChange={(e) => setAlertReport({ ...alertReport, recipient: e.target.value })}
                  />
                  <Textarea
                    placeholder="Alert Message"
                    value={alertReport.message}
                    onChange={(e) => setAlertReport({ ...alertReport, message: e.target.value })}
                  />
                  <Select
                    value={alertReport.severity}
                    onValueChange={(val) => setAlertReport({ ...alertReport, severity: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={submitAlert}
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
                  >
                    Send Alert
                  </Button>
                </div>
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-800">File a New Incident Report</h4>
                  <Input
                    placeholder="Site ID"
                    value={incidentReport.site}
                    onChange={(e) => setIncidentReport({ ...incidentReport, site: e.target.value })}
                  />
                  <Select
                    value={incidentReport.type}
                    onValueChange={(val) => setIncidentReport({ ...incidentReport, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Incident Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEAR_MISS">Near Miss</SelectItem>
                      <SelectItem value="HAZARD_REPORT">Hazard Report</SelectItem>
                      <SelectItem value="EQUIPMENT_MALFUNCTION">Equipment Malfunction</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Location (Lat,Lon)"
                    value={incidentReport.location.coordinates.join(",")}
                    onChange={(e) =>
                      setIncidentReport((prev) => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: e.target.value.split(",").map(Number),
                        },
                      }))
                    }
                    name="coordinates"
                  />
                  <Textarea
                    placeholder="Detailed Description"
                    value={incidentReport.description}
                    onChange={(e) =>
                      setIncidentReport({ ...incidentReport, description: e.target.value })
                    }
                  />
                  <Button
                    onClick={submitIncident}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Submit Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>My Recent Incident Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[70vh] overflow-y-auto">
                {incidents.length > 0 ? (
                  incidents.map((inc) => (
                    <div key={inc._id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{inc.type}</p>
                          <p className="text-sm text-gray-600">{inc.description}</p>
                        </div>
                        <Badge variant={inc.status === "Resolved" ? "default" : "secondary"}>
                          {inc.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Reported: {new Date(inc.timestamp).toLocaleString()}
                      </p>
                      {inc.status !== "Resolved" && (
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => updateIncidentStatus(inc._id, inc.status)}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No incidents reported.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "carbon" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Carbon Footprint Overview</CardTitle>
              <CardDescription>
                View-only access to company-wide carbon metrics (static data).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm">
                  Fuel Consumption:{" "}
                  <span className="font-bold">
                    {staticCarbonData.fuelConsumption.toFixed(2)} Liters
                  </span>
                </p>
                <p className="text-lg font-bold mt-2">
                  Est. CO₂ Emissions:{" "}
                  <span className="text-green-600">
                    {staticCarbonData.estimatedEmissions.toFixed(2)} kg CO₂
                  </span>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Carbon Neutrality Suggestions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Optimize haul routes to reduce fuel consumption.</li>
                  <li>Transition to electric or hybrid heavy machinery.</li>
                  <li>Maintain equipment for peak fuel efficiency.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default WorkerDashboard;
