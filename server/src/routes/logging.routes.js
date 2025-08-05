import { Router } from "express";
import { createLog, getAllLogs, getLogByTxHash } from "../controllers/logging.controller.js"; // Corrected import
import { verifyJWT, verifyRole } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply JWT and Admin Role verification to all routes in this file
router.use(verifyJWT, verifyRole(["Admin"]));

// Route to create a new log entry
router.post("/", createLog);

// Route to retrieve all log entries
router.get("/", getAllLogs);

// New route to get a log by its transaction hash
router.get("/tx/:hash", getLogByTxHash);

export default router;