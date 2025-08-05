import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer", "").trim();

    if (!token) {
      return res.status(401).json(new ApiError("Unauthorized: No token provided", 401));
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json(new ApiError("Unauthorized: User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(new ApiError("Unauthorized: Invalid or expired token", 401));
  }
});

export const verifyRole = (allowedRoles = []) => {
    return asyncHandler((req, res, next) => {
        // 1. Check if user object exists (ensures verifyJWT ran first)
        if (!req.user) {
            throw new ApiError(401, "Unauthorized: User not authenticated.");
        }

        // 2. Check if the user's role is in the list of allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403, // 403 Forbidden is more appropriate than 401 Unauthorized here
                `Forbidden: Your role (${req.user.role}) does not have permission to access this resource.`
            );
        }

        // 3. If all checks pass, proceed to the next middleware or controller
        next();
    });
};
