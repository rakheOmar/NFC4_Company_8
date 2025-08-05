import express from "express";
import { getAdminOverview } from "../controllers/admin.controller.js";

const router = express.Router();

// GET endpoint for admin overview dashboard data
router.get("/overview", getAdminOverview);

export default router;
