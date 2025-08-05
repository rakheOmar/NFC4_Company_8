// src/seedSites.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { Site } from "./models/site.model.js";
import { User } from "./models/user.model.js";
import { Equipment } from "./models/equipment.model.js";
import { Sensor } from "./models/sensor.model.js";
import { DB_NAME } from "./constants.js";

dotenv.config({ path: "./.env" });

const seedSites = async () => {
  try {
    await connectDB();

    // Clear existing sites (optional)
    await Site.deleteMany({});

    // Fetch already seeded workers, equipment, and sensors
    const workers = await User.find({ role: "Worker" }).select("_id");
    const equipments = await Equipment.find().select("_id");
    const sensors = await Sensor.find().select("_id");

    if (!workers.length || !equipments.length || !sensors.length) {
      throw new Error("Workers, Equipment, or Sensors are missing. Seed them first.");
    }

    // Divide workers, equipment, and sensors among sites
    const siteData = [
      {
        name: "North Mine Alpha",
        location: { type: "Point", coordinates: [78.9629, 20.5937] },
        address: "Sector 1, Industrial Zone, City A",
        manager: workers[0]._id,
        workers: workers.slice(0, Math.ceil(workers.length / 2)),
        equipments: equipments.slice(0, Math.ceil(equipments.length / 2)),
        sensors: sensors.slice(0, Math.ceil(sensors.length / 2)),
      },
      {
        name: "South Mine Beta",
        location: { type: "Point", coordinates: [79.0193, 21.1458] },
        address: "Sector 2, Industrial Zone, City B",
        manager: workers[1]._id,
        workers: workers.slice(Math.ceil(workers.length / 2)),
        equipments: equipments.slice(Math.ceil(equipments.length / 2)),
        sensors: sensors.slice(Math.ceil(sensors.length / 2)),
      },
    ];

    await Site.insertMany(siteData);

    console.log("Sites seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding sites:", error);
    process.exit(1);
  }
};

seedSites();
