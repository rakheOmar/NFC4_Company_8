import React from "react";
import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import LocationsDashboard from "@/components/LocationsDashboard";
import LiveOverview from "@/components/LiverOverview";

const customStyles = `
  @keyframes pulseUnderline {
    0% {
      transform: scaleX(0);
      transform-origin: bottom right;
    }
    50% {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
    100% {
      transform: scaleX(0);
      transform-origin: bottom left;
    }
  }

  .pulse-underline {
    display: inline-block;
    position: relative;
  }

  .pulse-underline::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 100%;
    height: 2px;
    background-color: #3b82f6; /* Tailwind's blue-500 */
    transform: scaleX(0);
    transform-origin: bottom right;
    animation: pulseUnderline 2s ease-in-out infinite;
  }
`;

function Home() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 75 }, // Starts 75px down
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const fadeInUpDelayed = {
    hidden: { opacity: 0, y: 75 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } },
  };

  return (
    <div className="home-page">
      <style>{customStyles}</style>

      <HeroSection />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="pt-12 pb-6 bg-white"
      >
        <div className="container mx-auto px-4 text-center bg-white">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            <span className="pulse-underline">Live Environmental AQI</span>
          </h2>
          <p className="text-lg text-gray-600">
            Real-time Air Quality Index (AQI) data from major mining regions across India.
          </p>
          <div className="mt-4 w-24 h-1 bg-primary mx-auto"></div>
        </div>
      </motion.div>

      <motion.main
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUpDelayed}
        className="container mx-auto px-4 pb-8 bg-white"
      >
        <LocationsDashboard />
        <LiveOverview />
      </motion.main>
    </div>
  );
}

export default Home;