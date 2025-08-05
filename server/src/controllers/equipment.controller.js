import { Equipment } from "../models/equipment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAllEquipment = asyncHandler(async (req, res) => {
  const equipments = await Equipment.find();
  return res.status(200).json(new ApiResponse(200, "All equipment fetched successfully", equipments));
});

export const getEquipmentsBySite = asyncHandler(async (req, res) => {
  const equipments = await Equipment.find({ site: req.params.siteId });
  return res.status(200).json(new ApiResponse(200, "Equipments fetched successfully", equipments));
});

export const getEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.equipmentId);
  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }
  return res.status(200).json(new ApiResponse(200, "Equipment fetched successfully", equipment));
});

export const createEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.create(req.body);
  return res.status(201).json(new ApiResponse(201, "Equipment created successfully", equipment));
});

export const updateEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findByIdAndUpdate(req.params.equipmentId, req.body, {
    new: true,
  });
  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }
  return res.status(200).json(new ApiResponse(200, "Equipment updated successfully", equipment));
});

export const deleteEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findByIdAndDelete(req.params.equipmentId);
  if (!equipment) {
    throw new ApiError(404, "Equipment not found");
  }
  return res.status(200).json(new ApiResponse(200, "Equipment deleted successfully"));
});
