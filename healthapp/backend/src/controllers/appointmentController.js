/**
 * METASCALE HEALTH: APPOINTMENT & RESOURCE ORCHESTRATOR (appointmentController.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This controller manages the 'Temporal Logistics' of the Clinical OS. 
 * It ensures that patient-doctor encounters are scheduled within strict 
 * clinical boundaries and that medical resource (specialist time) is 
 * allocated without collisions.
 * 
 * ─── CLINICAL PROTOCOLS ─────────────────────────────────────────────────────
 *   1. TEMPORAL BOUNDARIES: Appointments must occur within clinical hours 
 *      (08:00 - 22:00) and within a specific calendar horizon (Today -> Year End).
 *   2. CONFLICT RESOLUTION: The system performs a pre-flight check to 
 *      guarantee a specialist isn't double-booked for the same temporal coordinate.
 *   3. LIFECYCLE TRANSITIONS: Consultations follow a linear state machine:
 *      PENDING (Request) -> CONFIRMED (Scheduled) -> COMPLETED (Post-Review).
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * CONSULTATION RESERVATION (bookAppointment)
 * 
 * Logic:
 *   - Identity Extraction: Identifies the requesting patient from the JWT context.
 *   - Temporal Guard 1 (Hours): Strips the timestamp and verifies it falls 
 *     within the 08:00-22:00 clinical window.
 *   - Temporal Guard 2 (Horizon): Normalizes 'today' to T00:00:00 and 
 *     verifies the date is neither in the past nor beyond the current year.
 *   - Collision Guard: Queries the 'appointments' ledger for existing 
 *     non-cancelled sessions for that doctor/date/time combination.
 */
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctor_id, appt_date, appt_time, reason, type } = req.body;
    const patient_id = req.user.id; // Authorized identity from 'protect' middleware.

    // ─── STAGE 1: CLINICAL TIME VALIDATION ────────────────────────────────────
    // Extraction: Splitting HH:MM to perform granular integer comparison.
    const [hours, minutes] = appt_time.split(':').map(Number);
    if (hours < 8 || hours > 21 || (hours === 21 && minutes > 0)) {
      return sendError(res, 'Temporal Violation: Clinical hours are restricted to 08:00 - 21:00.', 400);
    }

    // ─── STAGE 2: TEMPORAL HORIZON VALIDATION ─────────────────────────────────
    const requestedDate = new Date(appt_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ground zero for date comparison.
    
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    if (requestedDate < today || requestedDate > monthEnd) {
      return sendError(res, 'Protocol Deviation: Appointments must be strictly within the current month.', 400);
    }

    // ─── STAGE 3: RESOURCE COLLISION CHECK ────────────────────────────────────
    // Logic: We must ensure the 'Clinical Specialist' (Doctor) is available.
    // We ignore 'cancelled' sessions as they represent vacated slots.
    const [existing] = await pool.query(
      "SELECT id FROM appointments WHERE doctor_id = ? AND appt_date = ? AND appt_time = ? AND status != 'cancelled'",
      [doctor_id, appt_date, appt_time]
    );

    if (existing.length > 0) {
      return sendError(res, 'Resource Collision: specialist is already engaged at this coordinate.', 409);
    }

    // ─── STAGE 4: REPOSITORY COMMIT ───────────────────────────────────────────
    const [result] = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appt_date, appt_time, reason, type, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [patient_id, doctor_id, appt_date, appt_time, reason, type || 'in-person']
    );

    return sendSuccess(res, { id: result.insertId }, 'Consultation request synchronized for specialist review.', 201);
  } catch (err) {
    next(err); // Hands off to global errorMiddleware.js
  }
};

/**
 * PATIENT ROSTER RETRIEVAL (getPatientAppointments)
 * Logic: Retrieves the longitudinal history of consultations for a patient.
 * Join Logic: Hydrates the doctor's name and specialization from the 'users' ledger.
 */
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, d.full_name as doctor_name, d.specialization 
       FROM appointments a 
       JOIN users d ON a.doctor_id = d.id 
       WHERE a.patient_id = ? ORDER BY a.appt_date DESC, a.appt_time DESC`,
      [req.user.id]
    );
    return sendSuccess(res, rows, 'Patient consultation history retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * DOCTOR PRACTICE ROSTER (getDoctorAppointments)
 * Logic: Provides the healthcare professional with their active patient list.
 * Data Context: Includes age and gender (demographics) for clinical preparation.
 */
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, p.full_name as patient_name, p.age, p.gender 
       FROM appointments a 
       JOIN users p ON a.patient_id = p.id 
       WHERE a.doctor_id = ? ORDER BY a.appt_date DESC, a.appt_time DESC`,
      [req.user.id]
    );
    return sendSuccess(res, rows, 'Doctor practice roster synchronized.');
  } catch (err) {
    next(err);
  }
};

/**
 * CLINICAL STATE TRANSITION (updateStatus)
 * 
 * Logic:
 *   - Progression: Moves a session from 'pending' to 'confirmed' or 'completed'.
 *   - Medical Record Commit: Allows the doctor to append 'doctor_notes' (Clinical Observations).
 *   - Persistence: Utilizes COALESCE to prevent accidental erasure of existing notes.
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, doctor_notes } = req.body;

    await pool.query(
      `UPDATE appointments SET status = ?, doctor_notes = COALESCE(?, doctor_notes) WHERE id = ?`,
      [status, doctor_notes, id]
    );

    return sendSuccess(res, {}, 'Consultation state mutation successful.');
  } catch (err) {
    next(err);
  }
};

/**
 * SESSION CANCELLATION (cancelAppointment)
 * Logic: Empowers the patient to retract a clinical request.
 * Authorization: Verifies the 'patient_id' matches the session identity.
 */
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patient_id = req.user.id;

    // GUARD: Prevents cross-identity record mutation.
    const [appt] = await pool.query("SELECT * FROM appointments WHERE id = ? AND patient_id = ?", [id, patient_id]);
    if (!appt.length) return sendError(res, 'Authorization Error: Record mismatch or access denied.', 404);

    await pool.query("UPDATE appointments SET status = 'cancelled' WHERE id = ?", [id]);
    return sendSuccess(res, {}, 'Appointment successfully vacated.');
  } catch (err) {
    next(err);
  }
};



