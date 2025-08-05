import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// --- ADDED ---
// Define a schema for GeoJSON points for location tracking
const pointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // --- ADDED: A unique ID for workers, more stable than email for operations ---
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // No changes to phone/address fields, they are good for profiles
    countryCode: {
      type: String,
      required: true,
      default: "+91",
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String, // URL to the avatar image
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // --- MODIFIED: Roles are now specific to the mining context ---
    role: {
      type: String,
      enum: ["Worker", "Supervisor", "Manager", "Admin"],
      default: "Worker",
      required: true,
    },
    refreshToken: {
      type: String,
    },

    // --- SECTION ADDED: Operational fields for the mining platform ---
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    currentLocation: {
      type: pointSchema,
      index: "2dsphere", // Crucial for efficient geo-queries
    },
    ppeStatus: {
      // Real-time status updated by CV model or simulator
      helmet: { type: Boolean, default: true },
      vest: { type: Boolean, default: true },
      mask: { type: Boolean, default: false },
    },
    isOnline: {
      // To check if the worker's tracker is active
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// --- YOUR EXISTING METHODS ARE PERFECT, NO CHANGES NEEDED ---

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Note: You might want to add employeeId and site to the JWT payload
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
      role: this.role,
      // --- ADDED to JWT for easier access on the frontend ---
      employeeId: this.employeeId,
      site: this.site,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
