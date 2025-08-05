import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white px-8 py-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <ShieldCheck className="text-[#a44406]" />
            <span className="font-semibold text-lg">CoalGuard</span>
          </div>
          <p className="text-gray-400">
            Advanced safety and sustainability platform for modern coal mining operations.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-2">Contact Us</h4>
          <div className="flex items-center text-gray-400 space-x-2 mb-1">
            <Mail size={16} />
            <span>contact@coalguard.tech</span>
          </div>
          <div className="flex items-center text-gray-400 space-x-2">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>
        </div>

        {/* Take Our Survey */}
        <div>
          <h4 className="font-semibold mb-2">Take Our Survey</h4>
          <p className="text-gray-400 mb-2">Help us improve by sharing your feedback.</p>
          <button
            onClick={() => window.open("/survey", "_blank")}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Take Our Survey
          </button>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-gray-400 space-y-1">
            <li>
              <Link to="/privacy-policy" className="hover:text-orange-500 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="hover:text-orange-500 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-orange-500 transition">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/support" className="hover:text-orange-500 transition">
                Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-600 text-xs mt-8 border-t border-gray-800 pt-4">
        Â© 2024 CoalGuard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
