import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-gray-800 px-4 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Your Data</h2>
            <p>
              We collect only essential data needed to enhance user experience, improve safety
              features, and monitor site analytics. We do not sell your data to any third-party
              services.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Security</h2>
            <p>
              All your information is encrypted and securely stored. Our platform uses modern
              cybersecurity protocols to prevent unauthorized access or misuse.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Data Usage</h2>
            <p>
              We use your data to personalize your dashboard, generate insights, and deliver
              real-time alerts relevant to your coal mining operations.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
            <p>
              We may integrate with third-party analytics and alert systems. These services are
              vetted for compliance and security.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-600">
          For any questions regarding our privacy policy, feel free to contact us at
          support@coalguard.tech
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
