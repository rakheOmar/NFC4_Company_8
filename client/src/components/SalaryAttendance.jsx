import React from "react";
import { FaRegCreditCard } from "react-icons/fa";

const SalaryAttendance = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="card salary-card">
      <h3 className="card-title">$ Salary & Attendance</h3>
      <div className="salary-summary">
        <div className="summary-box">
          <p>This Month</p>
          <span>{formatCurrency(data.thisMonth)}</span>
        </div>
        <div className="summary-box">
          <p>Attendance</p>
          <span>{data.attendance}</span>
        </div>
      </div>
      <div className="monthly-progress">
        <div className="progress-header">
          <p>Monthly Progress</p>
          <p>{data.progress}%</p>
        </div>
        <div className="progress-bar-container gray-bg">
          <div className="progress-bar" style={{ width: `${data.progress}%` }}></div>
        </div>
      </div>
      <div className="salary-breakdown">
        <p>
          <span>Base Salary:</span> <span>{formatCurrency(data.base)}</span>
        </p>
        <p>
          <span>Safety Bonus:</span>{" "}
          <span className="text-green">+ {formatCurrency(data.safetyBonus)}</span>
        </p>
        <p>
          <span>Overtime:</span>{" "}
          <span className="text-green">+ {formatCurrency(data.overtime)}</span>
        </p>
      </div>
      <button className="btn btn-secondary">
        <FaRegCreditCard /> View Payslip
      </button>
    </div>
  );
};

export default SalaryAttendance;
