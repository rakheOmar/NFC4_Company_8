import React from "react";

const LiveOverview = () => {
  return (
    <section className="py-10 px-4 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Live Overview</h2>

        {/* Top row: Camera & Environmental Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white h-64 rounded-lg shadow-md flex items-center justify-center text-gray-500 text-lg border">
            Camera Feed (Live)
          </div>
          <div className="bg-white h-64 rounded-lg shadow-md flex items-center justify-center text-gray-500 text-lg border">
            Environmental Stats (Live)
          </div>
        </div>

        {/* Bottom row: Workers Safe, Machines Running, AQI */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Workers Safe Card */}
          <div className="border border-green-300 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Workers Safe</h3>
              <span className="text-green-500 text-sm flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span> LIVE
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600">342</div>
            <p className="text-sm text-gray-600 mt-1">↑ 12 workers since shift start</p>
          </div>

          {/* Machines Running Card */}
          <div className="border border-orange-300 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Machines Running</h3>
              <span className="text-orange-500 text-sm flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span> LIVE
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-700">89</div>
            <p className="text-sm text-gray-600 mt-1">98.5% operational efficiency</p>
          </div>

          {/* Air Quality Index Card */}
          <div className="border border-green-300 rounded-lg bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Air Quality Index</h3>
              <span className="text-green-500 text-sm flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span> LIVE
              </span>
            </div>
            <div className="text-3xl font-bold text-green-600">Good</div>
            <p className="text-sm text-gray-600 mt-1">AQI: 45 • ↓ from yesterday</p>
          </div>
        </div>

        {/* --- Added Section: 4 Cards --- */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Comprehensive Mining Intelligence</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Four core modules designed to transform coal mining operations with cutting-edge
            technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-md">
                <span className="text-green-500 text-xl">🛡️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Worker Safety Monitoring</h3>
                <p className="text-sm text-gray-600">
                  Real-time tracking of worker locations, vital signs, and safety equipment status
                  with instant emergency response capabilities.
                </p>
                <ul className="text-green-600 text-sm mt-2 list-disc list-inside space-y-1">
                  <li>Live health vitals monitoring</li>
                  <li>GPS location tracking</li>
                  <li>Automatic emergency alerts</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-md">
                <span className="text-orange-500 text-xl">⚡</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">AI-Powered Alerts</h3>
                <p className="text-sm text-gray-600">
                  Machine learning algorithms analyze patterns and predict potential hazards,
                  providing proactive safety warnings and operational insights.
                </p>
                <ul className="text-orange-600 text-sm mt-2 list-disc list-inside space-y-1">
                  <li>Predictive hazard detection</li>
                  <li>Equipment failure prediction</li>
                  <li>Pattern recognition analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-md">
                <span className="text-green-500 text-xl">🌿</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Carbon Footprint Estimation</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive environmental monitoring and carbon emission tracking to support
                  sustainability goals and regulatory compliance.
                </p>
                <ul className="text-green-600 text-sm mt-2 list-disc list-inside space-y-1">
                  <li>Real-time emissions monitoring</li>
                  <li>Carbon footprint analytics</li>
                  <li>Regulatory reporting automation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-2">
              <div className="bg-orange-100 p-2 rounded-md">
                <span className="text-orange-500 text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">R&D Project Tracker</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive project management for research initiatives, innovation tracking,
                  and technology development in mining operations.
                </p>
                <ul className="text-orange-600 text-sm mt-2 list-disc list-inside space-y-1">
                  <li>Project milestone tracking</li>
                  <li>Innovation metrics dashboard</li>
                  <li>Team collaboration tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveOverview;
