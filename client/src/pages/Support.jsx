import React from "react";

const Support = () => {
  return (
    <div className="bg-white text-black px-6 md:px-20 py-12">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">Support</h1>

      <p className="text-justify mb-4">
        Need help? Our team is here to support you with everything from technical assistance to
        understanding carbon tracking and compliance.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">1. General Support</h2>
      <p className="text-justify mb-4">
        For common issues regarding login, account settings, or dashboard usage, visit our FAQs or
        use the live chat on the bottom-right of the screen.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">2. Technical Help</h2>
      <p className="text-justify mb-4">
        If you're facing platform errors, data issues, or integration problems, please reach out to
        our technical support team. Attach screenshots or error logs if possible for faster
        resolution.
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">3. Contact Methods</h2>
      <p className="text-justify mb-4">
        - 📧 Email:{" "}
        <a href="mailto:support@coalguard.tech" className="text-blue-600">
          support@coalguard.tech
        </a>
        <br />
        - 📞 Phone: +91-XXXXXXXXXX
        <br />- 🕒 Hours: Mon–Fri, 9AM–6PM IST
      </p>

      <h2 className="text-xl font-semibold text-orange-600 mb-2">4. On-site Help</h2>
      <p className="text-justify">
        For enterprise clients, we offer on-site training and support in coordination with your
        safety and IT departments. Please contact us to schedule a visit.
      </p>
    </div>
  );
};

export default Support;
