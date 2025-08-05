import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import "../App.css";
import InfoCard from "./InfoCard.jsx";
import WorkInstructions from "./WorkInstructions.jsx";
import SalaryAttendance from "./SalaryAttendance.jsx";
import Sidebar from "./Sidebar.jsx";
import socket from "../socket.js";
import { FaRegClock, FaShieldAlt, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [isCheckedIn, setIsCheckedIn] = useState(
    () => localStorage.getItem(`isCheckedIn_${user?._id}`) === "true"
  );

  const [team, setTeam] = useState(
    () => JSON.parse(localStorage.getItem("teamData")) || { online: 8, offline: 4 }
  );

  const [salaryData, setSalaryData] = useState(
    () =>
      JSON.parse(localStorage.getItem(`salaryData_${user?._id}`)) || {
        thisMonth: 45500,
        attendance: "23/24",
        progress: 96,
        base: 40000,
        safetyBonus: 3000,
        overtime: 2500,
      }
  );

  const instructions = [
    { id: 1, title: "Safety equipment check", status: "completed", detail: "Completed at 6:15 AM" },
    {
      id: 2,
      title: "Coal extraction - Section B",
      status: "progress",
      detail: "In progress - 65% complete",
    },
    { id: 3, title: "Equipment maintenance", status: "scheduled", detail: "Scheduled for 2:00 PM" },
  ];

  const handleCheckIn = () => {
    if (!isCheckedIn && user?._id) {
      socket.emit("workerCheckIn", { workerId: user._id });
      setIsCheckedIn(true);
      localStorage.setItem(`isCheckedIn_${user?._id}`, "true");
    }
  };

  const handleCheckOut = () => {
    if (isCheckedIn && user?._id) {
      socket.emit("workerCheckOut", { workerId: user._id });
      setIsCheckedIn(false);
      localStorage.setItem(`isCheckedIn_${user?._id}`, "false");
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const handleWorkerCheckInUpdate = (data) => {
      setTeam((prevTeam) => {
        const newTeam = {
          online: prevTeam.online + 1,
          offline: Math.max(0, prevTeam.offline - 1),
        };
        localStorage.setItem("teamData", JSON.stringify(newTeam));
        return newTeam;
      });

      if (data.workerId === user._id) {
        setSalaryData((prevSalary) => {
          const [attended, total] = prevSalary.attendance.split("/").map(Number);
          const newAttended = attended + 1;
          const newSalary = {
            ...prevSalary,
            attendance: `${newAttended}/${total}`,
            thisMonth: prevSalary.thisMonth + 500,
            progress: Math.round((newAttended / total) * 100),
          };
          localStorage.setItem(`salaryData_${user._id}`, JSON.stringify(newSalary));
          return newSalary;
        });
      }
    };

    const handleWorkerCheckOutUpdate = (data) => {
      setTeam((prevTeam) => {
        const newTeam = {
          online: Math.max(0, prevTeam.online - 1),
          offline: prevTeam.offline + 1,
        };
        localStorage.setItem("teamData", JSON.stringify(newTeam));
        return newTeam;
      });
    };

    socket.on("workerCheckInUpdate", handleWorkerCheckInUpdate);
    socket.on("workerCheckOutUpdate", handleWorkerCheckOutUpdate);

    return () => {
      socket.off("workerCheckInUpdate", handleWorkerCheckInUpdate);
      socket.off("workerCheckOutUpdate", handleWorkerCheckOutUpdate);
    };
  }, [user?._id]);

  return (
    <div className="dashboard-container relative">
      <Sidebar user={user} />
      <div className="main-content lg:ml-64 p-4">
        <Header />
        <div className="dashboard-grid">
          <InfoCard
            icon={<FaRegClock />}
            title="Shift Status"
            value={isCheckedIn ? "Active" : "Inactive"}
            subtext={isCheckedIn ? "Checked in" : "Not checked in"}
          >
            {!isCheckedIn && (
              <button
                onClick={handleCheckIn}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow mt-2"
              >
                Check In
              </button>
            )}
            {isCheckedIn && (
              <button
                onClick={handleCheckOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow mt-2"
              >
                Check Out
              </button>
            )}
          </InfoCard>

          <InfoCard icon={<FaShieldAlt />} title="Safety Score" value="98%" progress={98} />
          <InfoCard
            icon={<FaUsers />}
            title="Team Members"
            value={team.online + team.offline}
            subtext={`${team.online} online, ${team.offline} offline`}
          />
          <InfoCard
            icon={<FaExclamationTriangle />}
            title="Alerts"
            value="3"
            subtext="2 new, 1 pending"
            alert={true}
          />

          <WorkInstructions instructions={instructions} />
          <SalaryAttendance data={salaryData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
