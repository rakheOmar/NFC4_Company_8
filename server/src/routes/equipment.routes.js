import { Router } from "express";
import {
  getAllEquipment, // <-- Make sure this is imported
  getEquipmentsBySite,
  getEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "../controllers/equipment.controller.js";
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply JWT verification to all routes AFTER the initial GET
router.use(verifyJWT);

// --- NEW ROUTE ---
// GET all equipment (any logged-in user)
// This must come BEFORE other specific routes like /:equipmentId
router.get("/", getAllEquipment);

// POST new equipment (Admin only)
router.post("/", verifyRole(["Admin"]), createEquipment);

// GET all equipment for a specific site
router.get("/site/:siteId", getEquipmentsBySite);

// --- Specific Equipment Routes ---
router.get("/:equipmentId", getEquipment);
router.patch("/:equipmentId", verifyRole(["Admin"]), updateEquipment);
router.delete("/:equipmentId", verifyRole(["Admin"]), deleteEquipment);

export default router;
