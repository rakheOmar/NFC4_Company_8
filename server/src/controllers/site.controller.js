import { Site } from "../models/site.model.js";
import { User } from "../models/user.model.js";
import { Equipment } from "../models/equipment.model.js";
import { Sensor } from "../models/sensor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getSites = asyncHandler(async (req, res) => {
  const sites = await Site.find().populate("manager", "fullname email");
  return res.status(200).json(new ApiResponse(200, "Sites fetched successfully", sites));
});

export const getSite = asyncHandler(async (req, res) => {
  const site = await Site.findById(req.params.siteId).populate([
    {
      path: "manager",
      select: "fullname email",
    },
    {
      path: "workers",
      select: "fullname email role isOnline",
    },
    {
      path: "equipments",
      select: "name type status fuelType",
    },
    {
      path: "sensors",
      select: "type locationDescription status",
    },
  ]);

  if (!site) {
    throw new ApiError(404, "Site not found");
  }
  return res.status(200).json(new ApiResponse(200, "Site fetched successfully", site));
});

export const createSite = asyncHandler(async (req, res) => {
  const { name, location, address, manager } = req.body;
  if (!name || !location || !address) {
    throw new ApiError(400, "Name, location, and address are required");
  }
  const site = await Site.create({ name, location, address, manager });
  return res.status(201).json(new ApiResponse(201, "Site created successfully", site));
});

export const updateSite = asyncHandler(async (req, res) => {
  const site = await Site.findByIdAndUpdate(req.params.siteId, req.body, { new: true });
  if (!site) {
    throw new ApiError(404, "Site not found");
  }
  return res.status(200).json(new ApiResponse(200, "Site updated successfully", site));
});

export const deleteSite = asyncHandler(async (req, res) => {
  const site = await Site.findByIdAndDelete(req.params.siteId);
  if (!site) {
    throw new ApiError(404, "Site not found");
  }
  return res.status(200).json(new ApiResponse(200, "Site deleted successfully"));
});

export const assignWorkerToSite = asyncHandler(async (req, res) => {
  const { siteId, userId } = req.params;
  const site = await Site.findById(siteId);
  const user = await User.findById(userId);

  if (!site || !user) {
    throw new ApiError(404, "Site or User not found");
  }

  const isAlreadyAssigned = site.workers.includes(userId);
  if (isAlreadyAssigned) {
    throw new ApiError(409, `User ${user.fullname} is already assigned to this site.`);
  }

  const existingAssignment = await Site.findOne({ workers: userId });
  if (existingAssignment) {
    throw new ApiError(
      409,
      `User is already assigned to another site: ${existingAssignment.name}.`
    );
  }

  site.workers.push(userId);
  await site.save();

  return res
    .status(200)
    .json(new ApiResponse(200, `Assigned ${user.fullname} to site ${site.name}`, site));
});

export const assignEquipmentToSite = asyncHandler(async (req, res) => {
  const { siteId, equipmentId } = req.params;
  const site = await Site.findById(siteId);
  const equipment = await Equipment.findById(equipmentId);

  if (!site || !equipment) {
    throw new ApiError(404, "Site or Equipment not found");
  }

  const isAlreadyAssigned = site.equipments.includes(equipmentId);
  if (isAlreadyAssigned) {
    throw new ApiError(409, `Equipment ${equipment.name} is already assigned to this site.`);
  }

  // This logic assumes equipment can only be in one site's array at a time.
  const existingAssignment = await Site.findOne({ equipments: equipmentId });
  if (existingAssignment) {
    throw new ApiError(
      409,
      `Equipment is already assigned to another site: ${existingAssignment.name}.`
    );
  }

  site.equipments.push(equipmentId);
  await site.save();

  return res
    .status(200)
    .json(new ApiResponse(200, `Assigned ${equipment.name} to site ${site.name}`, site));
});

export const assignSensorToSite = asyncHandler(async (req, res) => {
  const { siteId, sensorId } = req.params;
  const site = await Site.findById(siteId);
  const sensor = await Sensor.findById(sensorId);

  if (!site || !sensor) {
    throw new ApiError(404, "Site or Sensor not found");
  }

  const isAlreadyAssigned = site.sensors.includes(sensorId);
  if (isAlreadyAssigned) {
    throw new ApiError(
      409,
      `Sensor ${sensor.type} (${sensor._id}) is already assigned to this site.`
    );
  }

  const existingAssignment = await Site.findOne({ sensors: sensorId });
  if (existingAssignment) {
    throw new ApiError(
      409,
      `Sensor is already assigned to another site: ${existingAssignment.name}.`
    );
  }

  site.sensors.push(sensorId);
  await site.save();

  return res
    .status(200)
    .json(new ApiResponse(200, `Assigned Sensor ${sensor._id} to site ${site.name}`, site));
});
