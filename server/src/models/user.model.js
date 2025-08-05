import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const pointSchema = new Schema(
  {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullname: { type: String, required: true, trim: true, index: true },
    employeeId: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    avatar: { type: String },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["Worker", "Admin"],
      default: "Worker",
      required: true,
    },
    refreshToken: { type: String },
    currentLocation: { type: pointSchema, index: "2dsphere" },
    ppeStatus: {
      helmet: { type: Boolean, default: false },
      vest: { type: Boolean, default: false },
      mask: { type: Boolean, default: false },
    },
    isOnline: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      employeeId: this.employeeId,
      site: this.site,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
