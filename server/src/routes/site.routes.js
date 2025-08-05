import { Router } from "express";
import {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
  assignWorkerToSite,
  assignEquipmentToSite,
  assignSensorToSite,
} from "../controllers/site.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply JWT verification to all routes in this file to ensure the user is authenticated.
router.use(verifyJWT);

// --- Site Collection Routes ---

// GET all sites (accessible to any logged-in user)
router.get("/", getSites);

// POST a new site (Admin only)
router.post("/", verifyRole(["Admin"]), createSite);

// --- Specific Site Routes (by siteId) ---

// GET a single site with populated details (any logged-in user)
router.get("/:siteId", getSite);

// PATCH/update a site (Admin only)
router.patch("/:siteId", verifyRole(["Admin"]), updateSite);

// DELETE a site (Admin only)
router.delete("/:siteId", verifyRole(["Admin"]), deleteSite);

// --- Site Assignment Routes (Admin Only) ---

// POST to assign a user/worker to a site
router.post("/:siteId/assign-worker/:userId", verifyRole(["Admin"]), assignWorkerToSite);

// POST to assign a piece of equipment to a site
router.post("/:siteId/assign-equipment/:equipmentId", verifyRole(["Admin"]), assignEquipmentToSite);

// POST to assign a sensor to a site
router.post("/:siteId/assign-sensor/:sensorId", verifyRole(["Admin"]), assignSensorToSite);

export default router;
