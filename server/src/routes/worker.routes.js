import express from "express";
import { getAllWorkers } from "../controllers/worker.controller.js";

const router = express.Router();

// GET /api/v1/workers
router.get("/", getAllWorkers);

export default router;
