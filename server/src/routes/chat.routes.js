import { Router } from "express";
import { handleChat, handleAISuggestion } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, handleChat);
router.post("/ai-analysis", verifyJWT, handleAISuggestion);

export default router;