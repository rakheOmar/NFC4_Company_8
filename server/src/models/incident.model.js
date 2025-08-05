// IncidentReport.js
import mongoose, { Schema } from 'mongoose';

// Define a simple GeoJSON Point schema for location
const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    required: true
  }
});

// Define the schema for an Incident
const incidentSchema = new Schema(
  {
    // Reference to the Site where the incident occurred
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site", // Assuming you have a 'Site' model
      required: [true, 'Site ID is required'],
    },
    // Type of incident, with specific enumerated values
    type: {
      type: String,
      required: [true, 'Incident type is required'],
      enum: [
        "PPE_VIOLATION", // AI Detected
        "DANGER_ZONE_ENTRY", // AI Detected
        "EQUIPMENT_MALFUNCTION", // Worker/AI Reported
        "HAZARD_REPORT", // Worker Reported
        "NEAR_MISS", // Worker Reported
        "ENVIRONMENTAL_SPILL", // Worker/AI Reported
        "OTHER" // Added 'Other' for flexibility if not covered by enums
      ],
    },
    // Severity of the incident
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    // Current status of the incident report
    status: {
      type: String,
      enum: ["Reported", "Investigating", "Resolved"],
      default: "Reported",
    },
    // Detailed description of the incident
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'], // Increased max length
    },
    // Geographic location of the incident
    location: {
      type: pointSchema,
      required: [true, 'Location coordinates are required'],
    },
    // The ID of the user who reported the incident (can be null for AI-generated)
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a 'User' model
      default: null, // Can be null if AI-generated
    },
    // List of users involved in the incident
    involvedUsers: [{
      type: Schema.Types.ObjectId,
      ref: "User"
    }],
    // Equipment involved in the incident
    involvedEquipment: {
      type: Schema.Types.ObjectId,
      ref: "Equipment" // Assuming you have an 'Equipment' model
    },
    // URLs to media (images, videos) related to the incident
    mediaUrls: [String],
    // Notes on how the incident was resolved
    resolutionNotes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Resolution notes cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
  }
);

// Corrected export: Use named export for the Mongoose model
export const Incident = mongoose.model('Incident', incidentSchema);
