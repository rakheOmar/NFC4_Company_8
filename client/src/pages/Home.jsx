import React from "react";
import HeroSection from "../components/HeroSection"; // Adjust path as per your project structure
import LiveOverview from "../components/LiverOverview"; // Adjust path as per your project structure

/**
 * Home Component
 *
 * This component serves as the main landing page for the application.
 * It integrates the HeroSection and LiveOverview components to provide
 * an initial engaging experience and a summary of live data or key features.
 */
function Home() {
  return (
    <div className="home-page">
      {/* The HeroSection typically introduces the application or its main purpose */}
      <HeroSection />

      {/* The LiveOverview provides real-time data or a quick summary */}
      <LiveOverview />

      {/* You can add more components or content here for the home page */}
    </div>
  );
}

export default Home;
