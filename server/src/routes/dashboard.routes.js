import express from "express";
import { getLiveOverview } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/live-overview", getLiveOverview);

export default router;
