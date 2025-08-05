import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link
import { FaRegBell, FaCog, FaExpand, FaUserShield } from "react-icons/fa";

// The component now accepts props to customize its content
const Header = ({ dashboardType = "Worker" }) => {
  // ... (keep the useState and useEffect for the clock as is) ...
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>CoalMine Pro</h1>
        <p>{dashboardType} Dashboard</p>
      </div>
      <div className="header-info">
        <div className="header-time">
          <span>{formattedTime}</span>
          <span>{formattedDate}</span>
        </div>

        {/* Conditionally render the Admin Panel link */}
        {dashboardType === "Worker" && (
          <Link to="/admin" className="admin-panel-link">
            <FaUserShield /> Admin Panel
          </Link>
        )}

        <div className="header-icons">
          <FaRegBell className="icon" />
          <FaCog className="icon" />
          <FaExpand className="icon" />
        </div>
      </div>
    </header>
  );
};

export default Header;
