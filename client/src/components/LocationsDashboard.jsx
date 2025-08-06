/*
================================================================================
  1. LocationsDashboard.js
  - This is the main dashboard component.
  - Gradients have been added to the main container and the individual cards.
================================================================================
*/
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

// --- Helper function for AQI status ---
const getAqiInfo = (aqi) => {
  if (isNaN(aqi)) return { status: "N/A", className: "text-gray-800 bg-gray-100 dark:text-gray-300 dark:bg-gray-700" };
  const val = Math.round(aqi);
  if (val <= 50) return { status: "Good", className: "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900" };
  if (val <= 100) return { status: "Moderate", className: "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900" };
  if (val <= 150) return { status: "Unhealthy for Sensitive", className: "text-orange-800 bg-orange-100 dark:text-orange-200 dark:bg-orange-900" };
  if (val <= 200) return { status: "Unhealthy", className: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900" };
  if (val <= 300) return { status: "Very Unhealthy", className: "text-purple-800 bg-purple-100 dark:text-purple-200 dark:bg-purple-900" };
  return { status: "Hazardous", className: "text-pink-800 bg-pink-100 dark:text-pink-200 dark:bg-pink-900" };
};


// --- EnvironmentalMonitoring component ---
const EnvironmentalMonitoring = ({ aqi, stationName }) => {
  if (!aqi && !stationName) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl shadow-md h-full flex flex-col justify-center items-center text-center">
        <FaMapMarkerAlt className="text-gray-300 dark:text-gray-500 text-4xl mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200">Select a Mine</h3>
        <p className="text-gray-500 dark:text-slate-400">
          Click a marker on the map or a mine from the lists below to view its specific system status.
        </p>
      </div>
    );
  }
  const getSystemStatus = (val) => {
    if (val <= 50) return { text: "Nominal", className: "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900" };
    if (val <= 100) return { text: "Normal", className: "text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900" };
    if (val <= 150) return { text: "Elevated", className: "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900" };
    if (val <= 200) return { text: "High Alert", className: "text-orange-800 bg-orange-100 dark:text-orange-200 dark:bg-orange-900" };
    return { text: "Critical", className: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900" };
  };
  const getVentilationStatus = (val) => {
    if (val <= 100) return { text: "Optimal", className: "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900" };
    if (val <= 150) return { text: "Increased Load", className: "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900" };
    return { text: "Maximum Load", className: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900" };
  };
  const getEmergencyStatus = (val) => {
    if (val <= 150) return { text: "Standby", className: "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900" };
    return { text: "Active", className: "text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900" };
  };

  const airQuality = getAqiInfo(aqi);
  const gasLevels = getSystemStatus(aqi);
  const ventilation = getVentilationStatus(aqi);
  const emergency = getEmergencyStatus(aqi);

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4">
        {stationName || "Regional Average Status"}
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 dark:text-slate-300 flex items-center gap-2">
            <FaWind className="text-blue-500" /> Air Quality
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${airQuality.className}`}>
            {Math.round(aqi)} - {airQuality.status}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 dark:text-slate-300 flex items-center gap-2">
            <FaSmog className="text-gray-500" /> Gas Level Monitoring
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${gasLevels.className}`}>
            {gasLevels.text}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 dark:text-slate-300 flex items-center gap-2">
            <FaTools className="text-gray-500" /> Ventilation System
          </span>
          <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${ventilation.className}`}>
            {ventilation.text}
          </span>
        </div>
        <div className="flex justify-between items-center text-base">
          <span className="font-semibold text-gray-600 dark:text-slate-300 flex items-center gap-2">
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
  <div className="bg-gradient-to-br from-white to-gray-100 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200 mb-4 flex items-center gap-2">
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
          className="flex justify-between items-center p-2 rounded-lg cursor-pointer hover:bg-gray-200/50 dark:hover:bg-slate-700/50 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">{mine.name}</span>
          <span className={`text-sm font-bold ${getAqiInfo(mine.aqi).className.split(" ")[0]}`}>
            {mine.aqi}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

// --- Static Mine Data ---
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
];

// --- Main LocationsDashboard Component ---
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
    // Mock AQI data generation for demonstration
    const generateMockData = () => {
        setIsLoading(true);
        const enrichedMines = allIndianMines.map(mine => ({
            ...mine,
            aqi: Math.floor(Math.random() * 250) + 1, // Random AQI between 1 and 251
        }));
        setMarkers(enrichedMines);
        setIsLoading(false);
    };
    generateMockData();
    const interval = setInterval(generateMockData, 30000); // Refresh data every 30 seconds
    return () => clearInterval(interval);
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    const query = searchQuery.toLowerCase();
    const foundMine = allIndianMines.find((mine) => mine.name.toLowerCase().includes(query));
    if (foundMine) {
      setMapCenter([foundMine.lat, foundMine.lon]);
      setMapZoom(12);
      setSelectedMine(foundMine);
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
  const displayName = selectedMine ? selectedMine.name : markers.length > 0 ? "Regional Average Status" : null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 dark:from-slate-900 dark:to-black p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 flex flex-col">
          <form onSubmit={handleSearch} className="mb-4" ref={searchContainerRef}>
            <div className="flex flex-wrap sm:flex-nowrap gap-2 relative">
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
                placeholder="Search for a mine in India..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-offset-slate-900 focus:outline-none bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200"
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 w-full sm:w-auto"
              >
                <FaSearch /> Search
              </button>
              {mapZoom > 5.2 && (
                <button
                  type="button"
                  onClick={handleResetView}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 w-full sm:w-auto"
                  title="Reset View"
                >
                  <FaGlobeAmericas />
                </button>
              )}
              {showSuggestions && filteredMines.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg shadow-lg z-[1001] max-h-60 overflow-y-auto">
                  <ul>
                    {filteredMines.map((mine) => (
                      <li
                        key={mine.uid}
                        onClick={() => handleSuggestionClick(mine)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-800 dark:text-slate-200"
                      >
                        {mine.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </form>
          <div className="flex-grow min-h-[60vh] lg:min-h-0">
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
        <div className="lg:w-1/3 space-y-6">
          <EnvironmentalMonitoring aqi={displayAqi} stationName={displayName} />
          {!isLoading && markers.length > 0 && (
            <>
              <AqiRankings
                title="Best AQI Mines"
                mines={bestMines}
                onMineClick={handleMineSelect}
                icon={<FaArrowDown className="text-green-800 dark:text-green-200" />}
                iconBgColor="bg-green-100 dark:bg-green-900"
              />
              <AqiRankings
                title="Worst AQI Mines"
                mines={worstMines}
                onMineClick={handleMineSelect}
                icon={<FaArrowUp className="text-red-800 dark:text-red-200" />}
                iconBgColor="bg-red-100 dark:bg-red-900"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationsDashboard;
