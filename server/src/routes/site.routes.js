import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"; // Assuming you have an admin check
import {
  createSite,
  getAllSites,
  getSiteById,
  getSiteDashboardStats,
} from "../controllers/site.controller.js";

const router = Router();

router.use(verifyJWT); // All site routes are protected

router.route("/").get(getAllSites).post(verifyAdmin, createSite);
router.route("/:siteId").get(getSiteById);
router.route("/:siteId/dashboard-stats").get(getSiteDashboardStats);

export default router;
