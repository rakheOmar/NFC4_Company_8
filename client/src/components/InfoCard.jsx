import React from "react";

const InfoCard = ({ icon, title, value, subtext, progress, alert, children }) => {
  const progressColor = alert ? "var(--red-color)" : "var(--primary-color)";
  const iconColor = alert ? "var(--red-color)" : "var(--blue-color)";

  return (
    <div className="card info-card">
      <div className="info-card-header">
        <div className="info-card-icon" style={{ color: iconColor }}>
          {icon}
        </div>
        <p className="info-card-title">{title}</p>
      </div>
      <div className="info-card-body">
        <h3 className="info-card-value">{value}</h3>
        {subtext && <p className="info-card-subtext">{subtext}</p>}
        {progress && (
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%`, backgroundColor: progressColor }}
            ></div>
          </div>
        )}
        {/* Extra content (like button) */}
        {children && <div className="mt-3">{children}</div>}
      </div>
    </div>
  );
};

export default InfoCard;
