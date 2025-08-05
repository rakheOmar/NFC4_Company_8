import React from "react";
import { FaSignInAlt, FaVideo, FaClipboardList, FaExclamationCircle } from "react-icons/fa";

const Sidebar = ({ user }) => {
  return (
    <aside className="sidebar">
      <div className="user-profile">
        <div className="avatar-placeholder"></div>
        <h2>{user.name}</h2>
        <p>{user.id}</p>
        <span>{user.level}</span>
      </div>
      <nav className="quick-actions">
        <h3>Quick Actions</h3>
        <ul>
          <li>
            <button className="action-btn active">
              <FaSignInAlt /> Check In
            </button>
          </li>
          <li>
            <button className="action-btn">
              <FaVideo /> Start Video Call
            </button>
          </li>
          <li>
            <button className="action-btn">
              <FaClipboardList /> View Instructions
            </button>
          </li>
          <li>
            <button className="action-btn">
              <FaExclamationCircle /> Report Safety Issue
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
