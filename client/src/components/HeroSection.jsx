import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative bg-white dark:bg-slate-900 overflow-hidden">
      {/* Background Aurora Effect */}
      <div className="absolute top-0 left-0 right-0 bottom-0 -z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-orange-200/40 dark:bg-orange-900/30 rounded-full filter blur-3xl opacity-70"
          style={{ animation: "blob 8s infinite" }}
        ></div>
        <div
          className="absolute top-[20%] right-[-10%] w-96 h-96 bg-green-200/40 dark:bg-green-900/30 rounded-full filter blur-3xl opacity-70"
          style={{ animation: "blob 12s infinite reverse" }}
        ></div>
      </div>

      {/* Adding a style tag for the font import and animation */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@800&display=swap');
          
          .font-title {
            font-family: 'Exo 2', sans-serif;
          }

          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }

          @keyframes dynamic-glow {
            0% {
              box-shadow: 0 0 3px #34d399, 0 0 5px #34d399, 0 0 8px #34d399;
            }
            50% {
              box-shadow: 0 0 10px #6ee7b7, 0 0 15px #6ee7b7, 0 0 20px #6ee7b7;
            }
            100% {
              box-shadow: 0 0 3px #34d399, 0 0 5px #34d399, 0 0 8px #34d399;
            }
          }

          .dynamic-glow {
            animation: dynamic-glow 2.5s infinite ease-in-out;
          }

          @keyframes text-shimmer {
            0% { background-position: 200% center; }
            100% { background-position: -200% center; }
          }

          .godly-text {
            background-image: linear-gradient(
              to right,
              #ffedd5,
              #ffffff,
              #fed7aa,
              #ffffff,
              #ffedd5
            );
            background-size: 200% auto;
            color: transparent;
            background-clip: text;
            -webkit-background-clip: text;
            animation: text-shimmer 4s linear infinite;
          }

          /* Synced Snake Underline Animations */
          @keyframes snake-underline {
            0% { transform: scaleX(0); }
            50% { transform: scaleX(1); }
            100% { transform: scaleX(0); }
          }
          
          .snake-underline {
            position: relative;
            display: inline-block;
          }

          .snake-underline::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            height: 2px;
            background-color: #f97316;
            width: 100%;
            transform-origin: left;
            animation: snake-underline 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .snake-underline-two::after {
            animation-delay: 3.5s;
          }
        `}
      </style>

      {/* The motion.div will animate its children on component load */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Top Section */}
        <div className="text-center text-gray-900 dark:text-gray-200 py-24 px-4">
          <div className="dynamic-glow inline-block bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-4 py-1 rounded-full text-sm font-medium mb-4 ring-1 ring-inset ring-green-200 dark:ring-green-800">
            ⚡ Advanced Mining Intelligence
          </div>

          <h1 className="font-title text-5xl md:text-6xl font-extrabold leading-tight uppercase tracking-wide">
            <span className="text-slate-900 dark:text-slate-200 snake-underline">
              Safety & Sustainability in
            </span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-[#c2540a] to-[#a44406] snake-underline snake-underline-two">
              Coal Mining Operations
            </span>
          </h1>

          <p className="text-xl font-medium text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-6">
            Real-time worker monitoring, AI-based safety alerts, carbon emission tracking, and R&D
            project management – all in one comprehensive platform for the future of coal mining.
          </p>
        </div>

        {/* Bottom Dark Section */}
        <div className="bg-gradient-to-br from-[#a44406] to-[#8c3a05] text-white py-20 px-4 text-center">
          <h2 className="godly-text font-title text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wide">
            Ready to Transform Your Mining Operations?
          </h2>
          <p className="text-xl font-medium mb-8 max-w-2xl mx-auto">
            Join the future of coal mining with our comprehensive safety and sustainability platform.
          </p>
          <Link to="/sentiment-summary">
            <button className="bg-white text-black font-medium px-6 py-3 rounded-md hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-lg">
              Explore Dashboard →
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;