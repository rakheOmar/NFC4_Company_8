// controllers/dashboard.controller.js
import { User } from "../models/user.model.js";
import { Equipment } from "../models/equipment.model.js";

export const getLiveOverview = async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: "Worker" });
    const workersSafe = await User.countDocuments({ role: "Worker", isOnline: true });
    const workersChange = Math.floor(Math.random() * 20);

    const totalMachines = await Equipment.countDocuments();
    const machinesRunning = await Equipment.countDocuments({ status: "Running" });

    const machineEfficiency =
      totalMachines > 0 ? ((machinesRunning / totalMachines) * 100).toFixed(1) : 0;

    res.json({
      totalWorkers,
      workersSafe,
      workersChange,
      totalMachines,
      machinesRunning,
      machineEfficiency,
    });
  } catch (err) {
    console.error("Error in live overview:", err);
    res.status(500).json({ message: "Failed to fetch live overview" });
  }
};
