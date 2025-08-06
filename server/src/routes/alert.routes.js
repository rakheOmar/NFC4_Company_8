import { Router } from "express";
import {
  createAlert,
  getAlertsByUserId,
  markAlertAsResolved,
} from "../controllers/alert.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route to create a new alert.
router.route("/").post(verifyJWT, createAlert);

// Route to get all alerts for a specific user.
// This directly corresponds to the `axios.get('/alerts/user/${userId}')` call in your frontend.
router.route("/user/:userId").get(verifyJWT, getAlertsByUserId);

// Route to mark a specific alert as resolved.
router.route("/:alertId/resolve").patch(verifyJWT, markAlertAsResolved);

export default router;
