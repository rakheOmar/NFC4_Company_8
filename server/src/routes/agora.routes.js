import { Router } from "express";
import { generateAgoraToken } from "../controllers/agora.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/token").post(verifyJWT, generateAgoraToken);

export default router;
