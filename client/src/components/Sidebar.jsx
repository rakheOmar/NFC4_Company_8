import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSignInAlt,
  FaVideo,
  FaClipboardList,
  FaExclamationCircle,
} from "react-icons/fa";

const Sidebar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-110 transition-transform"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl 
        transition-transform duration-300 z-40 rounded-r-2xl 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-700 backdrop-blur-md bg-white/5">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 shadow-inner" />
          <h2 className="text-xl font-bold">{user?.fullname || "Unknown User"}</h2>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>

        <nav className="p-6">
          <h3 className="font-semibold text-gray-300 mb-4 tracking-wide">Quick Actions</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="https://videocalling-pxsn-beta.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 
                transition backdrop-blur-sm shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <FaVideo /> <span>Start Video Call</span>
              </a>
            </li>
            <li>
              <button
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 
                transition backdrop-blur-sm shadow-md hover:scale-[1.02] active:scale-[0.98] w-full text-left"
              >
                <FaClipboardList /> <span>View Instructions</span>
              </button>
            </li>
            <li>
              <button
                className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 
                transition backdrop-blur-sm shadow-md hover:scale-[1.02] active:scale-[0.98] w-full text-left"
              >
                <FaExclamationCircle /> <span>Report Safety Issue</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
