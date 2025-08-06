
/*
================================================================================
  3. EnvironmentalMap.js
  - This component displays the Leaflet map.
  - Gradients have been added to the container and loading state.
================================================================================
*/
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

// --- Helper Functions (No changes here) ---
const getAqiInfoMap = (aqi) => {
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
  const aqiInfo = getAqiInfoMap(aqi);
  const iconHtml = `<div style="background-color: ${aqiInfo.color};" class="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-sm border-2 border-white shadow-lg">${aqi}</div>`;
  return L.divIcon({
    html: iconHtml,
    className: "bg-transparent border-0",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

// --- ZoneLayer component now uses the selectedMarker prop ---
const ZoneLayer = ({ selectedMarker }) => {
  const map = useMap();
  useEffect(() => {
    if (!selectedMarker) return;
    const aqiInfo = getAqiInfoMap(selectedMarker.aqi);
    const zone = L.circle([selectedMarker.lat, selectedMarker.lon], {
      radius: 25000,
      color: aqiInfo.color,
      fillColor: aqiInfo.color,
      fillOpacity: 0.3,
      weight: 1,
    }).addTo(map);
    return () => {
      map.removeLayer(zone);
    };
  }, [selectedMarker, map]);
  return null;
};

// --- MapClickHandler now calls onMarkerSelect to clear the selection ---
const MapClickHandler = ({ onMarkerSelect }) => {
  useMapEvents({
    click() {
      onMarkerSelect(null);
    },
  });
  return null;
};

// --- MapController ensures smooth panning and zooming ---
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      animate: true,
      duration: 1.5,
    });
  }, [center, zoom, map]);
  return null;
};

const EnvironmentalMap = ({ markers, isLoading, center, zoom, selectedMarker, onMarkerSelect }) => {
  const indiaBounds = [
    [5.9, 68.1],
    [35.5, 97.4],
  ];

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-100 p-6 rounded-xl shadow-md text-center h-full flex items-center justify-center">
        Loading Map & Environmental Data...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 p-2 rounded-xl shadow-md h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
        maxBounds={indiaBounds}
        minZoom={4}
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker
            key={marker.uid}
            position={[marker.lat, marker.lon]}
            icon={createAqiIcon(marker.aqi)}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                // Call the parent's handler function
                onMarkerSelect(marker);
              },
            }}
          >
            <Popup>
              <div className="font-sans">
                <h3 className="font-bold text-base mb-1">{marker.name}</h3>
                <p className="text-sm">
                  AQI:{" "}
                  <span className="font-bold" style={{ color: getAqiInfoMap(marker.aqi).color }}>
                    {marker.aqi}
                  </span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        <ZoneLayer selectedMarker={selectedMarker} />
        <MapClickHandler onMarkerSelect={onMarkerSelect} />
      </MapContainer>
    </div>
  );
};

export default EnvironmentalMap;