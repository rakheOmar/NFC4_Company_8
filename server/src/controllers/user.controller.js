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
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, employeeId, role } = req.body;

  if (
    [fullname, email, password, employeeId, site].some(
      (field) => !field || (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { employeeId }],
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or employee ID already exists");
  }

  const avatarLocalPath = req.file?.path;
  let avatar;
  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Avatar upload failed, please try again.");
    }
  }

  const user = await User.create({
    fullname,
    email: email.toLowerCase(),
    password,
    employeeId,
    role: role || "Worker", // Default to 'Worker' if not provided
    site,
    avatar: avatar?.url || "",
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res.status(201).json(new ApiResponse(201, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, employeeId, password } = req.body;

  if ((!email && !employeeId) || !password) {
    throw new ApiError(400, "Please provide an email or employee ID, and a password.");
  }

  const user = await User.findOne({
    $or: [{ email: email?.toLowerCase() }, { employeeId }],
  });

  if (!user) {
    throw new ApiError(404, "User not found with the provided credentials.");
  }

  const isPassValid = await user.isPasswordCorrect(password);

  if (!isPassValid) {
    throw new ApiError(401, "Invalid password.");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

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
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: No refresh token provided");
  }

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decodedToken?._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token: User not found");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Access token refreshed", {
        accessToken,
        refreshToken,
      })
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPassCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPassCorrect) {
    throw new ApiError(401, "Incorrect old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "Current user fetched successfully", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname && !email) {
    throw new ApiError(400, "Please provide at least one field to update (fullname or email)");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { fullname, email },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Account details updated successfully", updatedUser));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(new ApiResponse(200, "Avatar image updated successfully", user));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  if (!employeeId) {
    throw new ApiError(400, "Employee ID parameter is required");
  }

  const user = await User.findOne({ employeeId }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, "User profile fetched successfully", user));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  getUserProfile,
};
