import React from "react";

const Careers = () => {
  return (
    <div className="bg-white text-black px-6 md:px-20 py-12">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Careers at CoalGuard</h1>
      <p className="text-justify mb-4">
        At CoalGuard, we’re building the future of safe, sustainable mining. Join us in transforming
        an industry using technology, data, and purpose-driven design.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">1. Why Work With Us?</h2>
      <p className="text-justify mb-4">
        You'll work alongside passionate engineers, researchers, and designers who are committed to
        making coal mining safer and greener. We value innovation, ethics, and impact.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">2. Open Positions</h2>
      <p className="text-justify mb-4">
        - Frontend Developer (React, Tailwind)
        <br />
        - Data Analyst (AI/ML, Carbon Metrics)
        <br />
        - Field Safety Engineer (Mining Tech)
        <br />- Government Liaison (Sustainability Policy)
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">3. How to Apply</h2>
      <p className="text-justify">
        Send your resume and a short cover letter to{" "}
        <a href="mailto:careers@coalguard.tech" className="text-blue-600">
          careers@coalguard.tech
        </a>
        . We review applications on a rolling basis.
      </p>
    </div>
  );
};

export default Careers;
