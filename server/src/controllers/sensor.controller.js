import { Sensor } from "../models/sensor.model.js"; // Assumes both schemas are in here
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllSensors = asyncHandler(async (req, res) => {
  const sensors = await Sensor.find();
  return res.status(200).json(new ApiResponse(200, "All sensors fetched successfully", sensors));
});

export const getSensorsBySite = asyncHandler(async (req, res) => {
  const sensors = await Sensor.find({ site: req.params.siteId });
  return res.status(200).json(new ApiResponse(200, "Sensors fetched successfully", sensors));
});

export const getSensor = asyncHandler(async (req, res) => {
  const sensor = await Sensor.findById(req.params.sensorId);
  if (!sensor) {
    throw new ApiError(404, "Sensor not found");
  }
  return res.status(200).json(new ApiResponse(200, "Sensor fetched successfully", sensor));
});

export const createSensor = asyncHandler(async (req, res) => {
  const sensor = await Sensor.create(req.body);
  return res.status(201).json(new ApiResponse(201, "Sensor created successfully", sensor));
});

export const updateSensor = asyncHandler(async (req, res) => {
  const sensor = await Sensor.findByIdAndUpdate(req.params.sensorId, req.body, { new: true });
  if (!sensor) {
    throw new ApiError(404, "Sensor not found");
  }
  return res.status(200).json(new ApiResponse(200, "Sensor updated successfully", sensor));
});

export const deleteSensor = asyncHandler(async (req, res) => {
  const sensor = await Sensor.findByIdAndDelete(req.params.sensorId);
  if (!sensor) {
    throw new ApiError(404, "Sensor not found");
  }
  return res.status(200).json(new ApiResponse(200, "Sensor deleted successfully"));
});
