import React, { useState, useEffect } from "react";
import { FaThermometerHalf, FaWind, FaSmog, FaMapMarkerAlt } from "react-icons/fa";

// Helper function to interpret AQI value
const getAqiInfoStatus = (aqi) => {
  if (aqi <= 50) return { status: "Good", className: "text-green-600 bg-green-100" };
  if (aqi <= 100) return { status: "Moderate", className: "text-yellow-800 bg-yellow-100" };
  if (aqi <= 150)
    return { status: "Unhealthy for Sensitive", className: "text-orange-800 bg-orange-100" };
  if (aqi <= 200) return { status: "Unhealthy", className: "text-red-800 bg-red-100" };
  if (aqi <= 300) return { status: "Very Unhealthy", className: "text-purple-800 bg-purple-100" };
  return { status: "Hazardous", className: "text-maroon-800 bg-maroon-100" };
};

const EnvironmentalStatus = ({ data }) => {
  // State to hold the fetched Air Quality data
  const [aqiData, setAqiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from the AQI API
    const fetchAqi = async () => {
      // Access the API key securely from environment variables
      const apiKey = import.meta.env.VITE_AQI_API_KEY;
      const city = "mumbai"; // Using your location context
      const url = `https://api.waqi.info/feed/${city}/?token=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status !== "ok") {
          throw new Error(`API Error: ${result.data}`);
        }
        setAqiData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAqi();
  }, []); // Empty array ensures this effect runs only once when the component mounts

  // Determine the air quality status and style from the fetched data
  const aqiInfo = aqiData ? getAqiInfoStatus(aqiData.aqi) : null;

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-xl shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Environmental Status</h3>
      <ul className="space-y-4">
        <li className="flex justify-between items-center">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaThermometerHalf className="text-red-500" /> Temperature
          </span>
          <span className="font-bold text-gray-800">{data.temperature}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaWind className="text-blue-500" /> Air Quality
          </span>
          {isLoading && <span className="text-sm text-gray-400">Loading...</span>}
          {error && <span className="text-sm text-red-500">Failed to load</span>}
          {aqiData && (
            <span className={`px-2 py-0.5 text-sm font-bold rounded-full ${aqiInfo.className}`}>
              {aqiData.aqi} - {aqiInfo.status}
            </span>
          )}
        </li>
        <li className="flex justify-between items-center">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaSmog className="text-gray-500" /> Gas Levels
          </span>
          <span className="font-semibold text-green-600">{data.gasLevels}</span>
        </li>
        <li className="flex justify-between items-center">
          <span className="font-semibold text-gray-600 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-500" /> Location
          </span>
          <span className="font-bold text-gray-800">{data.location}</span>
        </li>
      </ul>
    </div>
  );
};

export default EnvironmentalStatus;

