/**
 * METASCALE HEALTH: CLINICAL WORKFLOW & SPECIALIST ROUTER (doctorRoutes.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This router governs the 'Professional Workspace' of the Clinical OS. 
 * it orchestrates the tools required for healthcare practitioners to 
 * manage their rosters, perform medical audits, and track practice performance.
 * 
 * ─── PROFESSIONAL PROTOCOLS ─────────────────────────────────────────────────
 *   1. CLINICAL DISCOVERY: Securely exposes the patient ledger and the 
 *      Universal Clinical Record (UCR) to authorized specialists.
 *   2. MEDICAL AUDITS: Provides the command for doctors to 'Finalize' an 
 *      AI screening via human validation.
 *   3. PRACTICE TELEMETRY: Exposes aggregated performance data (Accuracy, 
 *      Reach, Growth) used by the Doctor Dashboard frontend.
 * 
 * ─── SECURITY TOPOLOGY ──────────────────────────────────────────────────────
 *   - Tiered Authorization: Most endpoints require BOTH 'protect' (Session) 
 *     and 'authorize(doctor/admin)' (Role) to prevent privilege escalation.
 */

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// ─── STAGE 1: PATIENT POPULATION MANAGEMENT ────────────────────────────────

/**
 * CLINICAL ROSTER (GET /patients)
 * 
 * Purpose: Retrieves the searchable registry of all patients.
 * Permission: Accessible to Doctors and Administrators for population oversight.
 */
router.get('/patients', protect, authorize('doctor', 'admin'), doctorController.getAllPatients);

/**
 * CLINICAL DEEP-DIVE (GET /patients/:id)
 * 
 * Purpose: Provides a 360-degree view of a specific patient's context.
 * Param: :id - The unique clinical identifier (UID) for the patient.
 */
router.get('/patients/:id', protect, authorize('doctor', 'admin'), doctorController.getPatientDetail);

// ─── STAGE 2: DIAGNOSTIC VALIDATION & TELEMETRY ────────────────────────────

/**
 * PROFESSIONAL AUDIT (POST /review/:type/:id)
 * 
 * Logic:
 *   - Direction: Append human intelligence to AI-generated risk vectors.
 *   - Param: :type (liver/diabetes), :id (screening identifier).
 *   - Guard: Strictly limited to 'doctor' role.
 */
router.post('/review/:type/:id', protect, authorize('doctor'), doctorController.reviewScreening);

/**
 * PERFORMANCE ANALYTICS (GET /stats)
 * 
 * Purpose: Computes real-time practice metrics for the Clinical Command Center.
 * Access: Authenticated specialist only.
 */
router.get('/stats', protect, authorize('doctor'), doctorController.getDashboardStats);

module.exports = router;



