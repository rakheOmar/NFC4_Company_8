import React from "react";
import {
  FaCheckCircle,
  FaRegClock,
  FaExclamationTriangle,
  FaClipboard,
  FaClipboardList,
} from "react-icons/fa";

const getStatusIcon = (status) => {
  switch (status) {
    case "completed":
      return <FaCheckCircle className="icon-completed" />;
    case "progress":
      return <FaRegClock className="icon-progress" />;
    case "scheduled":
      return <FaExclamationTriangle className="icon-scheduled" />;
    default:
      return null;
  }
};

const WorkInstructions = ({ instructions }) => {
  return (
    <div className="card work-instructions-card">
      <h3 className="card-title">
        <FaClipboard /> Today's Work Instructions
      </h3>
      <div className="instructions-list">
        {instructions.map((item) => (
          <div key={item.id} className={`instruction-item status-${item.status}`}>
            <div className="instruction-icon">{getStatusIcon(item.status)}</div>
            <div className="instruction-details">
              <p className="instruction-title">{item.title}</p>
              <p className="instruction-detail">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary">
        <FaClipboardList /> View All Instructions
      </button>
    </div>
  );
};

export default WorkInstructions;
