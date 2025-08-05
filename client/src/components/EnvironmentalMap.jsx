import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// The getAqiInfo and createAqiIcon helper functions remain the same
const getAqiInfo = (aqi) => {
  if (aqi === "-" || aqi === undefined) return { status: "N/A", color: "#9CA3AF" };
  const val = parseInt(aqi);
  if (val <= 50) return { status: "Good", color: "#22C55E" };
  if (val <= 100) return { status: "Moderate", color: "#FBBF24" };
  if (val <= 150) return { status: "Unhealthy for Sensitive", color: "#F97316" };
  if (val <= 200) return { status: "Unhealthy", color: "#EF4444" };
  if (val <= 300) return { status: "Very Unhealthy", color: "#A855F7" };
  return { status: "Hazardous", color: "#881337" };
};

const createAqiIcon = (aqi) => {
  const aqiInfo = getAqiInfo(aqi);
  const iconHtml = `<div style="background-color: ${aqiInfo.color};" class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm border-2 border-white shadow-lg">${aqi}</div>`;
  return L.divIcon({
    html: iconHtml,
    className: "bg-transparent border-0",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// We will fetch data for these specific locations
const locationsToFetch = ["mumbai", "navi-mumbai", "thane", "bandra"];

const EnvironmentalMap = () => {
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllStationData = async () => {
      const apiKey = import.meta.env.VITE_AQI_API_KEY;

      // Create an array of fetch promises, one for each location
      const fetchPromises = locationsToFetch.map((city) =>
        fetch(`https://api.waqi.info/feed/${city}/?token=${apiKey}`).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${city}`);
          }
          return response.json();
        })
      );

      try {
        // Wait for all promises to settle (either succeed or fail)
        const results = await Promise.allSettled(fetchPromises);

        const validStations = results
          // Filter out any requests that failed
          .filter((result) => result.status === "fulfilled" && result.value.status === "ok")
          // Map the successful results to the format our map needs
          .map((result) => {
            const stationData = result.value.data;
            return {
              uid: stationData.idx,
              lat: stationData.city.geo[0],
              lon: stationData.city.geo[1],
              aqi: stationData.aqi,
              station: {
                name: stationData.city.name,
                time: stationData.time.s,
              },
            };
          });

        setStations(validStations);
      } catch (error) {
        console.error("An error occurred while fetching station data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllStationData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        Loading Map & Environmental Data...
      </div>
    );
  }

  return (
    <div className="bg-white p-2 rounded-xl shadow-md h-[600px]">
      <MapContainer
        center={[19.076, 72.8777]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {stations.map((station) => (
          <Marker
            key={station.uid}
            position={[station.lat, station.lon]}
            icon={createAqiIcon(station.aqi)}
          >
            <Popup>
              {/* The LocationPopup component can be used here if you have it */}
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1">{station.station.name}</h3>
                <p className="text-sm">
                  Air Quality Index (AQI):{" "}
                  <span className="font-bold" style={{ color: getAqiInfo(station.aqi).color }}>
                    {station.aqi}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {new Date(station.station.time).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default EnvironmentalMap;
