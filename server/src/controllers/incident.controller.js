// incidentController.js
import { Incident } from '../models/incident.model.js'; // Ensure this path is correct and use .js extension
import { ApiError } from '../utils/apiError.js'; // Assuming you have these utility files
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';


// @desc    Create a new incident report
// @route   POST /api/v1/incidents
// @access  Private (assuming authentication middleware will be applied)
export const createIncident = asyncHandler(async (req, res) => {
  // Extract all fields from the request body, matching the new schema
  const {
    site,
    type,
    severity,
    status,
    description,
    location, // This should be a GeoJSON Point object: { type: "Point", coordinates: [lon, lat] }
    reportedBy,
    involvedUsers,
    involvedEquipment,
    mediaUrls,
    resolutionNotes,
  } = req.body;

  // Basic validation for required fields
  if (!site || !type || !description || !location || !location.coordinates || location.coordinates.length !== 2) {
    throw new ApiError(400, 'Please provide site, type, description, and valid location coordinates (longitude, latitude) for the incident.');
  }

  // Create a new incident report in the database
  const newIncident = await Incident.create({
    site,
    type,
    severity, // Will use default if not provided
    status,   // Will use default if not provided
    description,
    location,
    reportedBy, // Will be null if not provided, as per schema default
    involvedUsers,
    involvedEquipment,
    mediaUrls,
    resolutionNotes,
    // timestamps will be automatically added by the schema
  });

  // Send a success response
  res.status(201).json(new ApiResponse(201, 'Incident reported successfully!', newIncident));
});

// @desc    Get all incident reports or incidents by a specific user
// @route   GET /api/v1/incidents
// @route   GET /api/v1/incidents/user/:userId
// @access  Private (assuming authentication middleware will be applied)
export const getIncidents = asyncHandler(async (req, res) => {
  let query = {};

  // If a userId is provided in the URL parameters, filter by it
  if (req.params.userId) {
    query.reportedBy = req.params.userId;
  }

  // Find incident reports based on the query, sort by createdAt descending
  // Populate relevant fields if you want to send back full user/site/equipment objects
  const incidents = await Incident.find(query)
    .populate('site', 'name') // Populate site with just its name
    .populate('reportedBy', 'fullname') // Populate reportedBy with just fullname
    .populate('involvedUsers', 'fullname') // Populate involvedUsers with fullname
    .populate('involvedEquipment', 'name type') // Populate involvedEquipment with name and type
    .sort({ createdAt: -1 }); // Use createdAt from timestamps

  // Send a success response with the found incidents
  res.status(200).json(new ApiResponse(200, 'Incidents fetched successfully', incidents));
});

// @desc    Get a single incident report by ID
// @route   GET /api/v1/incidents/:id
// @access  Private
export const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await Incident.findById(req.params.id)
    .populate('site', 'name')
    .populate('reportedBy', 'fullname')
    .populate('involvedUsers', 'fullname')
    .populate('involvedEquipment', 'name type');

  if (!incident) {
    throw new ApiError(404, 'Incident report not found.');
  }

  res.status(200).json(new ApiResponse(200, 'Incident fetched successfully', incident));
});

// @desc    Update an incident report
// @route   PATCH /api/v1/incidents/:id
// @access  Private
export const updateIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Find the incident by ID and update it
  const updatedIncident = await Incident.findByIdAndUpdate(id, updateData, {
    new: true, // Return the updated document
    runValidators: true, // Run schema validators on update
  });

  if (!updatedIncident) {
    throw new ApiError(404, 'Incident report not found.');
  }

  res.status(200).json(new ApiResponse(200, 'Incident report updated successfully!', updatedIncident));
});

// @desc    Delete an incident report
// @route   DELETE /api/v1/incidents/:id
// @access  Private
export const deleteIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedIncident = await Incident.findByIdAndDelete(id);

  if (!deletedIncident) {
    throw new ApiError(404, 'Incident report not found.');
  }

  res.status(200).json(new ApiResponse(200, 'Incident report deleted successfully!'));
});
