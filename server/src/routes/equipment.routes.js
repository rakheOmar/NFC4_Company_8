import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addEquipment,
  updateEquipmentStatus,
  updateEquipmentLocation,
} from "../controllers/equipment.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(addEquipment);
router.route("/:equipmentId/status").put(updateEquipmentStatus);
router.route("/:equipmentId/location").put(updateEquipmentLocation);

export default router;

// Note: The getEquipmentBySite would likely live in the site.routes.js file
// for a more RESTful URL structure, like GET /api/v1/sites/:siteId/equipment
