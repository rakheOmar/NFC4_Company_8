import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { Equipment } from "./models/equipment.model.js";

dotenv.config({ path: "./.env" });

const equipmentTypes = ["Excavator", "Dumper", "Drill", "ConveyorBelt", "VentilationFan"];
const statuses = ["Operational", "Idle", "Maintenance", "Offline"];
const fuelTypes = ["Diesel", "Electric", "Biodiesel"];

// Random float helper
const getRandomFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);

// Random int helper
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedEquipment = async () => {
  try {
    await connectDB();

    await Equipment.deleteMany({}); // clear old data

    const equipmentList = Array.from({ length: 10 }, (_, i) => ({
      name: `Equipment ${i + 1}`,
      equipmentId: `EQ${100 + i}`,
      type: equipmentTypes[getRandomInt(0, equipmentTypes.length - 1)],
      status: statuses[getRandomInt(0, statuses.length - 1)],
      fuelType: fuelTypes[getRandomInt(0, fuelTypes.length - 1)],
      runtimeHours: getRandomInt(50, 500),
      consumptionRate: getRandomFloat(5, 20),
      currentLocation: {
        type: "Point",
        coordinates: [
          77.5946 + Math.random() * 0.01, // Random small offset near some lat/lon
          12.9716 + Math.random() * 0.01,
        ],
      },
    }));

    await Equipment.insertMany(equipmentList);

    console.log("✅ Equipment seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding equipment:", error);
    process.exit(1);
  }
};

seedEquipment();
