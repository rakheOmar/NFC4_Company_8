import React from "react";

const TermsOfService = () => {
  return (
    <div className="bg-white text-black px-6 md:px-20 py-12">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Terms of Service</h1>
      <p className="text-justify mb-4">
        By using CoalGuard, you agree to be bound by the following terms and conditions. Please read
        them carefully.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">1. Use of Platform</h2>
      <p className="text-justify mb-4">
        You must use the platform only for lawful mining operations and in accordance with all
        applicable regulations. Misuse of services or attempts to bypass security will result in
        termination.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">2. Intellectual Property</h2>
      <p className="text-justify mb-4">
        All content, features, and tools provided by CoalGuard are protected by intellectual
        property laws. You may not reuse or reproduce any content without explicit permission.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">3. Limitation of Liability</h2>
      <p className="text-justify mb-4">
        We strive to ensure high availability and accurate data; however, we are not liable for any
        damages or losses due to interruptions, inaccuracies, or misuse of data from our platform.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">4. Modifications</h2>
      <p className="text-justify">
        CoalGuard reserves the right to update these terms at any time. Users will be notified of
        significant changes via email or dashboard notification.
      </p>
    </div>
  );
};

export default TermsOfService;
