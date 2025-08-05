import React from "react";

const AdminInfoCard = ({ title, value, subtext, trend, progress, icon }) => {
  return (
    <div className="card admin-info-card">
      <div className="admin-card-header">
        <p className="admin-card-title">{title}</p>
        <div className="admin-card-icon">{icon}</div>
      </div>
      <div className="admin-card-body">
        <h3 className="admin-card-value">{value}</h3>
        {subtext && <p className="admin-card-subtext">{subtext}</p>}
        {trend && <p className="admin-card-trend">{trend}</p>}
        {progress && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%`, backgroundColor: "#28a745" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInfoCard;
