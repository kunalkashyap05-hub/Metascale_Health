/**
 * METASCALE HEALTH: SYSTEM GOVERNANCE & OVERSIGHT (adminController.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This controller serves as the 'Command Center' for the Clinical OS. 
 * It manages the global health of the ecosystem, including system-wide 
 * analytics, trust-and-safety (identity verification), and provider governance.
 * 
 * ─── ADMINISTRATIVE PROTOCOLS ───────────────────────────────────────────────
 *   1. MULTIDIMENSIONAL ANALYTICS: Aggregates metrics across disparate tables 
 *      (Users, Liver, Diabetes) to provide a unified view of platform health.
 *   2. DOCTOR ONBOARDING: Implements a 'Zero-Trust' gateway where healthcare 
 *      providers must be manually 'Verified' (Approved) before gaining 
 *      clinical review privileges.
 *   3. IDENTITY LIFECYCLE: Provides atomic controls for activating or 
 *      suspending any node (user) in the clinical network to mitigate risk.
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * SYSTEM ANALYTICS ENGINE (getSystemAnalytics)
 * 
 * Logic:
 *   - Tiered Aggregation: This engine performs three parallel audits:
 *       1. Demographic Audit: Counts identities by Role (Admin/Doctor/Patient).
 *       2. Diagnostic Throughput: Aggregates the volume of screenings by domain.
 *       3. Temporal Trends: Uses DATE_FORMAT to group diagnostic events by 
 *          month, allowing for 12-month trailing velocity analysis.
 *   - Purpose: Informs capacity planning and identifies shifts in disease prevalence.
 */
exports.getSystemAnalytics = async (req, res, next) => {
  try {
    // 1. DEMOGRAPHIC ANALYTICS
    const [userStats] = await pool.query(
      "SELECT role, COUNT(*) as count FROM users GROUP BY role"
    );
    
    // 2. DIAGNOSTIC THROUGHPUT
    const [screeningStats] = await pool.query(
      `SELECT 'liver' as type, COUNT(*) as count FROM liver_screenings 
       UNION ALL 
       SELECT 'diabetes' as type, COUNT(*) as count FROM diabetes_screenings`
    );

    // 3. TEMPORAL TRENDS (12-Month Velocity)
    const [monthlyTrend] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
       FROM (SELECT created_at FROM liver_screenings UNION ALL SELECT created_at FROM diabetes_screenings) combined
       GROUP BY month ORDER BY month ASC LIMIT 12`
    );

    return sendSuccess(res, {
      users: userStats,
      screenings: screeningStats,
      trend: monthlyTrend
    }, 'System-wide telemetry report synchronized.');
  } catch (err) {
    next(err);
  }
};

/**
 * SPECIALIST ROSTER AUDIT (getDoctors)
 * Logic: Provides the administrator with the professional credentials 
 * and operational status (Approved/Active) of all healthcare providers.
 */
exports.getDoctors = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, email, specialization, hospital, is_approved, is_active FROM users WHERE role = 'doctor'"
    );
    return sendSuccess(res, rows, 'Verified specialists ledger retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * IDENTITY LIFECYCLE CONTROL (toggleUserStatus)
 * Logic: Provides 'Soft Termination' capabilities.
 *   - Setting 'is_active' to 0 immediately blocks the user from the 
 *     authController.js login flow and all protected routes.
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await pool.query("UPDATE users SET is_active = ? WHERE id = ?", [is_active ? 1 : 0, id]);
    return sendSuccess(res, {}, 'Identity operational state updated.');
  } catch (err) {
    next(err);
  }
};

/**
 * CLINICAL CREDENTIAL VERIFICATION (approveDoctor)
 * Logic: The 'Gateway to Practice'. 
 *   - Only when a doctor is 'Approved' can they access the 
 *     doctorDashboard.jsx and perform medical audits on screenings.
 */
exports.approveDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_approved = 1 WHERE id = ? AND role = 'doctor'", [id]);
    return sendSuccess(res, {}, 'Specialist credentials verified. Practice privileges activated.');
  } catch (err) {
    next(err);
  }
};

/**
 * TRUST & SAFETY ENFORCEMENT (rejectDoctor)
 * Logic: Rejection is a 'Safe Exit' strategy. It marks the record as 
 * unapproved and deactivates the node simultaneously.
 */
exports.rejectDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_approved = 0, is_active = 0 WHERE id = ? AND role = 'doctor'", [id]);
    return sendSuccess(res, {}, 'Application rejected. Identity safety-lock initialized.');
  } catch (err) {
    next(err);
  }
};

/**
 * SURVEILLANCE: PRIVILEGE REVOCATION (revokeApproval)
 * Logic: Revokes clinical review authority without deactivating the account. 
 * Used for doctors under administrative audit.
 */
exports.revokeApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET is_approved = 0 WHERE id = ? AND role = 'doctor'", [id]);
    return sendSuccess(res, {}, 'Clinical review privileges suspended.');
  } catch (err) {
    next(err);
  }
};



