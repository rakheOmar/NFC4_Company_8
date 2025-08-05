import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserProfile,
  getAllUsers,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Public Routes ---
// Handles file upload for the user's avatar during registration
router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

// --- Protected Routes (User must be logged in) ---
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", verifyJWT, refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update-account", verifyJWT, updateAccountDetails);
router.patch("/update-avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.get("/profile/:employeeId", verifyJWT, getUserProfile);
router.get("/", verifyJWT, getAllUsers);

export default router;
