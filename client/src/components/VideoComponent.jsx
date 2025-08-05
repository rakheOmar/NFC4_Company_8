import React from "react";
import { FaVideo, FaPhone, FaUsers, FaExclamationTriangle } from "react-icons/fa";

const VideoCommunication = () => {
  return (
    <div className="card video-card">
      <h3 className="card-title">
        <FaVideo /> Video Communication
      </h3>
      <div className="video-placeholder">
        <FaVideo className="camera-icon" />
        <p>Camera Off</p>
      </div>
      <div className="video-controls">
        <div className="control-buttons">
          <button className="btn btn-control">
            <FaPhone /> Call Supervisor
          </button>
          <button className="btn btn-control">
            <FaUsers /> Team Meeting
          </button>
          <button className="btn btn-control btn-emergency">
            <FaExclamationTriangle /> Emergency
          </button>
        </div>
        <div className="availability-toggle">
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider round"></span>
          </label>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCommunication;
