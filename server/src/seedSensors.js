// src/seedSensors.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Sensor } from "./models/sensor.model.js";
import { SensorReading } from "./models/sensor.model.js";
import connectDB from "./db/index.js";
import { DB_NAME } from "./constants.js";

dotenv.config({ path: "./.env" });

const seedSensors = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Sensor.deleteMany({});
    await SensorReading.deleteMany({});

    // Sample sensors
    const sensors = await Sensor.insertMany([
      {
        sensorHardwareId: "SENS-1001",
        type: "AirQuality",
        locationDescription: "Shaft 1 - Level 2",
        status: "Active",
      },
      {
        sensorHardwareId: "SENS-1002",
        type: "GasLeak",
        locationDescription: "Main Tunnel Entry",
        status: "Active",
      },
      {
        sensorHardwareId: "SENS-1003",
        type: "Temperature",
        locationDescription: "Control Room",
        status: "Active",
      },
      {
        sensorHardwareId: "SENS-1004",
        type: "Vibration",
        locationDescription: "Conveyor Belt #3",
        status: "Active",
      },
    ]);

    // Sample readings for each sensor
    const readings = [];
    sensors.forEach((sensor) => {
      for (let i = 0; i < 5; i++) {
        if (sensor.type === "AirQuality") {
          readings.push({
            sensor: sensor._id,
            reading: { co: Math.random() * 10, no2: Math.random() * 5, methane: Math.random() * 2 },
            timestamp: new Date(Date.now() - i * 60000),
          });
        } else if (sensor.type === "GasLeak") {
          readings.push({
            sensor: sensor._id,
            reading: { value: Math.random() * 1.5, unit: "ppm" },
            timestamp: new Date(Date.now() - i * 60000),
          });
        } else if (sensor.type === "Temperature") {
          readings.push({
            sensor: sensor._id,
            reading: { value: 20 + Math.random() * 5, unit: "°C" },
            timestamp: new Date(Date.now() - i * 60000),
          });
        } else if (sensor.type === "Vibration") {
          readings.push({
            sensor: sensor._id,
            reading: { value: Math.random() * 0.5, unit: "g" },
            timestamp: new Date(Date.now() - i * 60000),
          });
        }
      }
    });

    await SensorReading.insertMany(readings);

    console.log("Sensors and sensor readings seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding sensors:", err);
    process.exit(1);
  }
};

seedSensors();
