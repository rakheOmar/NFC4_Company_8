import React from "react";
import HeroSection from "../components/HeroSection"; // Adjust path as per your project structure
import LocationsDashboard from "@/components/LocationsDashboard"; // Adjust path as per your project structure
import LiveOverview from "@/components/LiverOverview"; // fixed typo

/**
 * Home Component
 * This component serves as the main landing page for the application.
 * It integrates the HeroSection, a title section, and the LocationsDashboard.
 */
function Home() {
  return (
    <div className="home-page">
      <HeroSection />

      {/* Separator with Title - Reduced Padding */}
      <div className="pt-12 pb-6 bg-gray-50">
        {" "}
        {/* Reduced bottom padding */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Live Environmental AQI</h2>
          <p className="text-gray-600">
            Real-time Air Quality Index (AQI) data from major mining regions across India.
          </p>
          <div className="mt-4 w-24 h-1 bg-primary mx-auto"></div>
        </div>
      </div>

      {/* Main content area with reduced top padding */}
      <main className="container mx-auto px-4 pb-8">
        {" "}
        {/* Removed top padding */}
        <LocationsDashboard />
        <LiveOverview />
      </main>
    </div>
  );
}

export default Home;
