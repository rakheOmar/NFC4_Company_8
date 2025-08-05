import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const accessToken = await user.generateAuthToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Something went wrong", 500);
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // MODIFIED: Added employeeId, site, and role to destructuring
  const { email, fullname, password, employeeId, site, role } = req.body;

  // MODIFIED: Updated validation check
  if (
    [email, fullname, password, employeeId, site, role].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  // MODIFIED: Check for employeeId as well as email
  const existingUser = await User.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or employee ID already exists");
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  // MODIFIED: Added new fields to the create call
  const user = await User.create({
    fullname,
    email: email.toLowerCase(),
    password,
    avatar: avatar.url,
    // --- New Fields ---
    employeeId,
    site,
    role,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed after registration");
  }

  return res.status(201).json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  // MODIFIED: Allow login with email or employeeId
  const { email, employeeId, password } = req.body;

  if (!password || (!email && !employeeId)) {
    throw new ApiError(400, "Email or Employee ID and password are required");
  }

  const user = await User.findOne({
    $or: [{ email }, { employeeId }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPassValid = await user.isPasswordCorrect(password);

  if (!isPassValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "User logged in successfully", {
        user: loggedInUser,
        accessToken,
      })
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incRefreshToken) {
    throw new ApiError("Please provide refresh token", 401);
  }

  const decodedToken = jwt.verify(incRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user.refreshToken !== incRefreshToken) {
    throw new ApiError("Invalid refresh token", 401);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Access token refreshed successfully", {
        accessToken,
        refreshToken,
      })
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const isPassCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPassCorrect) {
    throw new ApiError("Incorrect old password", 401);
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, "Current user fetched successfully", user));
});

const updateCurrentUser = asyncHandler(async (req, res) => {
  const { fullname, email, countryCode, phoneNumber, address } = req.body;

  if (!fullname || !email || !countryCode || !phoneNumber || !address) {
    throw new ApiError("Please provide all required fields", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname,
        email,
        countryCode,
        phoneNumber,
        address,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, "User updated successfully", updatedUser));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError("Avatar file is missing", 400);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError("Error while uploading avatar", 400);
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, "Avatar image updated successfully", user));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { email } = req.params;

  if (!email) {
    throw new ApiError("Email parameter is required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user));
});

const getAllWorkersBySite = asyncHandler(async (req, res) => {
  const { siteId } = req.params;
  if (!siteId) {
    throw new ApiError(400, "Site ID is required");
  }

  // Find all users for a site, excluding admins, and don't send back sensitive data
  const workers = await User.find({
    site: siteId,
    role: { $in: ["Worker", "Supervisor", "Manager"] },
  }).select("-password -refreshToken -address");

  if (!workers) {
    // This isn't an error, just might be an empty site
    return res.status(200).json(new ApiResponse(200, "No workers found for this site", []));
  }

  return res.status(200).json(new ApiResponse(200, "Workers fetched successfully", workers));
});

const updateUserLocation = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { coordinates } = req.body; // Expecting [longitude, latitude]

  if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
    throw new ApiError(400, "Valid coordinates array [longitude, latitude] is required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        currentLocation: {
          type: "Point",
          coordinates: coordinates,
        },
        isOnline: true,
      },
    },
    { new: true }
  ).select("employeeId fullname currentLocation isOnline");

  if (!updatedUser) {
    throw new ApiError(404, "User not found to update location");
  }

  return res.status(200).json(new ApiResponse(200, "Location updated successfully", updatedUser));
});

const updatePpeStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { helmet, vest, mask } = req.body;

  const updatePayload = {};
  if (typeof helmet === "boolean") updatePayload["ppeStatus.helmet"] = helmet;
  if (typeof vest === "boolean") updatePayload["ppeStatus.vest"] = vest;
  if (typeof mask === "boolean") updatePayload["ppeStatus.mask"] = mask;

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, "At least one PPE status (helmet, vest, mask) must be provided");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updatePayload },
    { new: true }
  ).select("employeeId ppeStatus");

  if (!updatedUser) {
    throw new ApiError(404, "User not found to update PPE status");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "PPE status updated successfully", updatedUser.ppeStatus));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateCurrentUser,
  updateUserAvatar,
  getUserProfile,
  getAllWorkersBySite,
  updateUserLocation,
  updatePpeStatus,
};
