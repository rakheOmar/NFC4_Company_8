import { Router } from "express";
import {
  getAllSensors, // <-- Make sure this is imported
  getSensorsBySite,
  getSensor,
  createSensor,
  updateSensor,
  deleteSensor,
} from "../controllers/sensor.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply JWT verification to all routes AFTER the initial GET
router.use(verifyJWT);

// --- NEW ROUTE ---
// GET all sensors (any logged-in user)
router.get("/", getAllSensors);

// POST a new sensor (Admin only)
router.post("/", verifyRole(["Admin"]), createSensor);

// GET all sensors for a specific site
router.get("/site/:siteId", getSensorsBySite);

// --- Specific Sensor Routes ---
router.get("/:sensorId", getSensor);
router.patch("/:sensorId", verifyRole(["Admin"]), updateSensor);
router.delete("/:sensorId", verifyRole(["Admin"]), deleteSensor);

export default router;
