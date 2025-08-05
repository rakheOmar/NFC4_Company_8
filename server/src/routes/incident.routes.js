import express from 'express';
import {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
} from '../controllers/incident.controller.js'; // Adjust path and add .js extension as needed

const router = express.Router();

// Base route for incidents: allows creating new incidents and getting all incidents
// POST /api/v1/incidents        - Create a new incident
// GET /api/v1/incidents         - Get all incidents
router.route('/').post(createIncident).get(getIncidents);

// Route for getting incident reports by a specific user ID
// GET /api/v1/incidents/user/:userId
router.route('/user/:userId').get(getIncidents);

// Routes for specific incident by ID: allows fetching, updating, and deleting
// GET /api/v1/incidents/:id     - Get a single incident by ID
// PATCH /api/v1/incidents/:id   - Update a specific incident
// DELETE /api/v1/incidents/:id  - Delete a specific incident
router.route('/:id').get(getIncidentById).patch(updateIncident).delete(deleteIncident);

export default router;
