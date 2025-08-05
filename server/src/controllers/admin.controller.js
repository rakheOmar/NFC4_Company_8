import { User } from "../models/user.model.js";
import { Equipment } from "../models/equipment.model.js";

export const getAdminOverview = async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: "Admin" });
    const totalSupervisors = await User.countDocuments({ role: "Supervisor" });
    const totalWorkers = await User.countDocuments({ role: "Worker" });

    const totalMachines = await Equipment.countDocuments();
    const machinesUnderMaintenance = await Equipment.countDocuments({ status: "Maintenance" });
    const machinesOffline = await Equipment.countDocuments({ status: "Offline" });

    const maintenancePercentage =
      totalMachines > 0 ? ((machinesUnderMaintenance / totalMachines) * 100).toFixed(1) : 0;

    res.json({
      totalAdmins,
      totalSupervisors,
      totalWorkers,
      totalMachines,
      machinesUnderMaintenance,
      machinesOffline,
      maintenancePercentage,
    });
  } catch (err) {
    console.error("Error in admin overview:", err);
    res.status(500).json({ message: "Failed to fetch admin overview" });
  }
};
