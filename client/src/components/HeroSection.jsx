import React from "react";

const HeroSection = () => {
  return (
    <section className="text-center">
      {/* Top Light Section */}
      <div className="bg-white text-gray-900 py-16 px-4">
        {/* Label */}
        <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
          ⚡ Advanced Mining Intelligence
        </div>

        {/* Main Heading - two lines */}
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          <div className="text-[#0f172a]">Safety & Sustainability in</div>
          <div className="text-[#a44406]">Coal Mining Operations</div>
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
          Real-time worker monitoring, AI-based safety alerts, carbon emission tracking, and R&D
          project management – all in one comprehensive platform for the future of coal mining.
        </p>
      </div>

      {/* Bottom Dark Section (Your Original Content) */}
      <div className="bg-[#a44406] text-white py-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to Transform Your Mining Operations?
        </h2>
        <p className="text-lg mb-8">
          Join the future of coal mining with our comprehensive safety and sustainability platform.
        </p>
        <button className="bg-white text-black font-medium px-6 py-3 rounded-md hover:bg-gray-200 transition">
          Explore Dashboard →
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
