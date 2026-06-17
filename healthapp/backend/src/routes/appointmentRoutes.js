/**
 * METASCALE HEALTH: CONSULTATION & CLINICAL SCHEDULING ROUTER (appointmentRoutes.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This router acts as the 'Temporal Traffic Controller' for the Clinical OS. 
 * It manages the reservation and lifecycle of clinical slots, ensuring that 
 * sessions between patients and specialists are authorized and logically valid.
 * 
 * ─── SECURITY HYGIENE: RBAC ISOLATION ───────────────────────────────────────
 * We utilize a dual-middleware guard for these endpoints:
 *   1. IDENTITY VERIFICATION (protect): Ensures the requester has a valid JWT.
 *   2. ROLE AUTHORIZATION (authorize): Enforces strict perimeter boundaries.
 *      - Patients CANNOT browse the practice schedules of doctors.
 *      - Doctors CANNOT book sessions on behalf of patients (Self-Service only).
 * 
 * ─── CLINICAL LIFECYCLE PROGRESSION ─────────────────────────────────────────
 * Routes define the path for a 'Consultation Entity' as it moves from 
 * a draft request to a finalized medical record with specialized observations.
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// ─── STAGE 1: PATIENT-CENTRIC OPERATIONS ────────────────────────────────────

/**
 * CLINICAL RESERVATION (POST /book)
 * 
 * Logic:
 *   - Tier Guard: Exclusive to 'patient' role.
 *   - Temporal Constraints: Handled by the controller (08:00 - 22:00 window).
 *   - Payload: Requires specialist ID, coordination date, and temporal slot.
 */
router.post('/book', protect, authorize('patient'), appointmentController.bookAppointment);

/**
 * LONGITUDINAL HISTORY (GET /patient)
 * 
 * Purpose: Allows the patient to view their upcoming and historical consultations.
 * Sorting: Categorized by chronological priority.
 */
router.get('/patient', protect, authorize('patient'), appointmentController.getPatientAppointments);

// ─── STAGE 2: PRACTITIONER-CENTRIC OPERATIONS ───────────────────────────────

/**
 * PRACTICE ROSTER (GET /doctor)
 * 
 * Purpose: Provides a real-time 'Agenda' for the verified healthcare practitioner.
 * Data Context: Hydrated with patient demographics for clinical screening preparation.
 */
router.get('/doctor', protect, authorize('doctor'), appointmentController.getDoctorAppointments);

/**
 * STATE MUTATION PIPELINE (PUT /:id/status)
 * 
 * Logic:
 *   - Progression: Transitions a session state (Pending -> Confirmed -> Completed).
 *   - Clinical Input: Used by doctors to inject 'Doctor Notes' during the 
 *     finalization of a consultation.
 */
router.put('/:id/status', protect, authorize('doctor'), appointmentController.updateStatus);

module.exports = router;



