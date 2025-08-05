import { User } from "../models/user.model.js";

export const getAllWorkers = async (req, res) => {
  try {
    const { status } = req.query;

    // Filter only workers
    let filter = { role: "Worker" };
    if (status && status !== "All Status") {
      filter.isOnline = status === "Active";
    }

    const workers = await User.find(filter)
      .select("fullname employeeId role isOnline ppeStatus currentLocation avatar")
      .lean();

    const formattedWorkers = workers.map((worker) => ({
      id: worker.employeeId || worker._id.toString(),
      name: worker.fullname,
      role: worker.role,
      status: worker.isOnline ? "Active" : "Offline",
      location: worker.currentLocation?.coordinates?.length
        ? `(${worker.currentLocation.coordinates[1]}, ${worker.currentLocation.coordinates[0]})`
        : "Unknown",
      safetyScore:
        worker.ppeStatus.helmet && worker.ppeStatus.vest && worker.ppeStatus.mask
          ? 100
          : worker.ppeStatus.helmet || worker.ppeStatus.vest || worker.ppeStatus.mask
          ? 80
          : 60,
      lastSeen: worker.isOnline ? "Online now" : "Offline",
      avatar: worker.avatar,
      ppeStatus: worker.ppeStatus,
    }));

    res.status(200).json(formattedWorkers);
  } catch (error) {
    console.error("Error fetching workers:", error);
    res.status(500).json({ message: "Failed to fetch workers" });
  }
};
