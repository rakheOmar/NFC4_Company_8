import React, { useState, useEffect, useMemo, useRef } from "react";
import EnvironmentalMap from "./EnvironmentalMap"; // Make sure this path is correct
import {
  FaWind,
  FaSmog,
  FaTools,
  FaExclamationTriangle,
  FaSearch,
  FaGlobeAmericas,
  FaMapMarkerAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

// --- EnvironmentalMonitoring component ---
const EnvironmentalMonitoring = ({ aqi, stationName }) => {
  if (!aqi && !stationName) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md h-full flex flex-col justify-center items-center text-center">
        <FaMapMarkerAlt className="text-gray-300 text-4xl mb-4" />
        <h3 className="text-lg font-semibold text-gray-700">Select a Mine</h3>
        <p className="text-gray-500">
          Click a marker on the map or a mine from the lists below to view its specific system
          status.
        </p>
      </div>
    );
  }
  const getSystemStatus = (val) => {
    if (val <= 50) return { text: "Nominal", className: "text-green-600 bg-green-100" };
    if (val <= 100) return { text: "Normal", className: "text-blue-600 bg-blue-100" };
    if (val <= 150) return { text: "Elevated", className: "text-yellow-800 bg-yellow-100" };
    if (val <= 200) return { text: "High Alert", className: "text-orange-800 bg-orange-100" };
    return { text: "Critical", className: "text-red-800 bg-red-100" };
  };
  const getVentilationStatus = (val) => {
    if (val <= 100) return { text: "Optimal", className: "text-green-600 bg-green-100" };
    if (val <= 150) return { text: "Increased Load", className: "text-yellow-800 bg-yellow-100" };
    return { text: "Maximum Load", className: "text-red-800 bg-red-100" };
  };
  const getEmergencyStatus = (val) => {
    if (val <= 150) return { text: "Standby", className: "text-green-600 bg-green-100" };
    return { text: "Active", className: "text-red-800 bg-red-100" };
  };

  const airQuality = getAqiInfo(aqi);
  const gasLevels = getSystemStatus(aqi);
  const ventilation = getVentilationStatus(aqi);
  const emergency = getEmergencyStatus(aqi);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {stationName || "Regional Average Status"}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaWind className="text-blue-500" /> Air Quality
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${airQuality.className}`}>
            {Math.round(aqi)} - {airQuality.status}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaSmog className="text-gray-500" /> Gas Level Monitoring
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${gasLevels.className}`}>
            {gasLevels.text}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaTools className="text-gray-500" /> Ventilation System
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${ventilation.className}`}>
            {ventilation.text}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaExclamationTriangle className="text-red-500" /> Emergency Systems
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${emergency.className}`}>
            {emergency.text}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- AqiRankings component ---
const AqiRankings = ({ title, mines, onMineClick, icon, iconBgColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span className={`flex items-center justify-center w-6 h-6 rounded-full ${iconBgColor}`}>
        {icon}
      </span>
      {title}
    </h3>
    <ul className="space-y-2">
      {mines.map((mine) => (
        <li
          key={mine.uid}
          onClick={() => onMineClick(mine)}
          className="flex justify-between items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-700">{mine.name}</span>
          <span className={`text-sm font-bold ${getAqiInfo(mine.aqi).className.split(" ")[0]}`}>
            {mine.aqi}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const getAqiInfo = (aqi) => {
  if (isNaN(aqi)) return { status: "N/A", className: "text-gray-800 bg-gray-100" };
  const val = Math.round(aqi);
  if (val <= 50) return { status: "Good", className: "text-green-800 bg-green-100" };
  if (val <= 100) return { status: "Moderate", className: "text-yellow-800 bg-yellow-100" };
  if (val <= 150)
    return { status: "Unhealthy for Sensitive", className: "text-orange-800 bg-orange-100" };
  if (val <= 200) return { status: "Unhealthy", className: "text-red-800 bg-red-100" };
  if (val <= 300) return { status: "Very Unhealthy", className: "text-purple-800 bg-purple-100" };
  return { status: "Hazardous", className: "text-maroon-800 bg-maroon-100" };
};

const allIndianMines = [
  { uid: "mine-1", name: "Jharia Coalfield, Dhanbad", lat: 23.75, lon: 86.42 },
  { uid: "mine-2", name: "Raniganj Coalfield, West Bengal", lat: 23.61, lon: 87.12 },
  { uid: "mine-3", name: "Bokaro Coalfield, Jharkhand", lat: 23.78, lon: 85.86 },
  { uid: "mine-4", name: "Talcher Coalfield, Odisha", lat: 20.95, lon: 85.22 },
  { uid: "mine-5", name: "Singrauli Coalfield, MP", lat: 24.19, lon: 82.67 },
  { uid: "mine-6", name: "Gevra Mine, Korba", lat: 22.33, lon: 82.55 },
  { uid: "mine-7", name: "Kusmunda Mine, Korba", lat: 22.32, lon: 82.71 },
  { uid: "mine-8", name: "Neyveli Lignite Mine, Tamil Nadu", lat: 11.61, lon: 79.48 },
  { uid: "mine-9", name: "Singareni Collieries, Telangana", lat: 17.5, lon: 80.28 },
  { uid: "mine-10", name: "North Karanpura Coalfield", lat: 23.85, lon: 85.25 },
  { uid: "mine-11", name: "Kamptee Coalfield, Nagpur", lat: 21.22, lon: 79.11 },
  { uid: "mine-12", name: "Ledo Coal Mine, Assam", lat: 27.29, lon: 95.73 },
  { uid: "mine-13", name: "Darrangiri Coalfield, Meghalaya", lat: 25.45, lon: 90.71 },
  { uid: "mine-14", name: "Sohagpur Coalfield, MP", lat: 23.3, lon: 81.35 },
  { uid: "mine-15", name: "Chandrapur (Majri Area), Maharashtra", lat: 19.97, lon: 79.29 },
  { uid: "mine-16", name: "Umrer (Nagpur District), Maharashtra", lat: 20.85, lon: 79.33 },
  { uid: "mine-17", name: "Kapurdi Lignite Mine (Barmer), Rajasthan", lat: 25.88, lon: 71.37 },
  { uid: "mine-18", name: "Matasukh Lignite Mine (Nagaur), Rajasthan", lat: 27.08, lon: 74.02 },
  { uid: "mine-19", name: "Panandhro Lignite Mine (Kutch), Gujarat", lat: 23.68, lon: 69.25 },
  { uid: "mine-20", name: "Rajpardi Lignite Mine (Bharuch), Gujarat", lat: 21.68, lon: 73.22 },
  { uid: "mine-21", name: "Jayant Coal Mine (Singrauli), MP", lat: 24.12, lon: 82.63 },
  { uid: "mine-22", name: "Gulbarga Region Mines, Karnataka", lat: 17.33, lon: 76.83 },
];

const LocationsDashboard = () => {
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([22.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5.2);
  const [selectedMine, setSelectedMine] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchMineAqiData = async () => {
      setIsLoading(true);
      const apiKey = import.meta.env.VITE_AQI_API_KEY;
      const fetchPromises = allIndianMines.map((mine) =>
        fetch(`https://api.waqi.info/feed/geo:${mine.lat};${mine.lon}/?token=${apiKey}`)
          .then((res) => res.json())
          .then((result) => ({ ...mine, apiResult: result }))
      );
      try {
        const results = await Promise.allSettled(fetchPromises);
        const enrichedMines = results
          .filter(
            (result) => result.status === "fulfilled" && result.value.apiResult.status === "ok"
          )
          .map((result) => ({ ...result.value, aqi: parseInt(result.value.apiResult.data.aqi) }));
        setMarkers(enrichedMines.filter((m) => !isNaN(m.aqi)));
      } catch (error) {
        console.error("Error fetching mine AQI data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMineAqiData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const query = searchQuery.toLowerCase();
    const foundMine = allIndianMines.find((mine) => mine.name.toLowerCase().includes(query));
    if (foundMine) {
      setMapCenter([foundMine.lat, foundMine.lon]);
      setMapZoom(12);
    } else {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) throw new Error("Location not found");
        const data = await response.json();
        setMapCenter([data.latitude, data.longitude]);
        setMapZoom(9);
      } catch (error) {
        console.error("Geocoding search failed:", error);
        alert(`Could not find coordinates for "${searchQuery}".`);
      }
    }
    setShowSuggestions(false);
  };

  const handleResetView = () => {
    setMapCenter([22.5937, 78.9629]);
    setMapZoom(5.2);
    setSearchQuery("");
    setSelectedMine(null);
  };

  const { bestMines, worstMines, averageAqi } = useMemo(() => {
    if (markers.length === 0) return { bestMines: [], worstMines: [], averageAqi: 0 };
    const sortedMines = [...markers].sort((a, b) => a.aqi - b.aqi);
    const totalAqi = markers.reduce((sum, marker) => sum + marker.aqi, 0);
    return {
      bestMines: sortedMines.slice(0, 5),
      worstMines: sortedMines.slice(-5).reverse(),
      averageAqi: totalAqi / markers.length,
    };
  }, [markers]);

  const handleMineSelect = (mine) => {
    setSelectedMine(mine);
    setMapCenter([mine.lat, mine.lon]);
    setMapZoom(12);
  };

  const handleSuggestionClick = (mine) => {
    setSearchQuery(mine.name);
    handleMineSelect(mine);
    setShowSuggestions(false);
  };

  const filteredMines = useMemo(() => {
    if (!searchQuery) return [];
    return allIndianMines.filter((mine) =>
      mine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayAqi = selectedMine ? selectedMine.aqi : markers.length > 0 ? averageAqi : null;
  const displayName = selectedMine
    ? selectedMine.name
    : markers.length > 0
      ? "Regional Average Status"
      : null;

  return (
    // --- UPDATED: Main layout now uses flexbox for equal height columns ---
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3 flex flex-col h-[85vh]">
        <form onSubmit={handleSearch} className="mb-4" ref={searchContainerRef}>
          <div className="flex gap-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => {
                if (searchQuery) setShowSuggestions(true);
              }}
              placeholder="Search for a city or mine in India..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90"
            >
              <FaSearch /> Search
            </button>
            {mapZoom > 5.2 && (
              <button
                type="button"
                onClick={handleResetView}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700"
                title="Reset View"
              >
                <FaGlobeAmericas />
              </button>
            )}
            {showSuggestions && filteredMines.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-[1001] max-h-60 overflow-y-auto">
                <ul>
                  {filteredMines.map((mine) => (
                    <li
                      key={mine.uid}
                      onClick={() => handleSuggestionClick(mine)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {mine.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
        <div className="flex-grow">
          <EnvironmentalMap
            markers={markers}
            isLoading={isLoading}
            center={mapCenter}
            zoom={mapZoom}
            selectedMarker={selectedMine}
            onMarkerSelect={handleMineSelect}
          />
        </div>
      </div>
      <div className="lg:w-1/3 h-[85vh] overflow-y-auto space-y-6">
        <EnvironmentalMonitoring aqi={displayAqi} stationName={displayName} />
        {!isLoading && markers.length > 0 && (
          <>
            <AqiRankings
              title="Best AQI Mines"
              mines={bestMines}
              onMineClick={handleMineSelect}
              icon={<FaArrowDown className="text-green-800" />}
              iconBgColor="bg-green-100"
            />
            <AqiRankings
              title="Worst AQI Mines"
              mines={worstMines}
              onMineClick={handleMineSelect}
              icon={<FaArrowUp className="text-red-800" />}
              iconBgColor="bg-red-100"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LocationsDashboard;
