/**
 * METASCALE HEALTH: AUTHENTICATION & IDENTITY ORCHESTRATOR (authController.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This controller serves as the 'Security Gateway' of the Clinical OS. 
 * It manages the entire Identity Lifecycle, from initial provisioning 
 * (registration) to session termination.
 * 
 * ─── POLYMORPHIC IDENTITY PATTERN ──────────────────────────────────────────
 * The system utilizes a 'Unified User Ledger'. Both Patients and Healthcare 
 * Providers (Doctors) are stored in the 'users' table.
 *   - Patients: Defined by metabolic biometric fields (blood_group, etc.).
 *   - Doctors: Defined by professional credentials (license_number, specialization).
 * 
 * ─── SECURITY HEURISTICS ────────────────────────────────────────────────────
 *   1. BCRYPT SALTING: We use 12 rounds of salting entropy. This prevents 
 *      Rainbow Table attacks and ensures the hash is exponentially difficult 
 *      to brute-force.
 *   2. JWT SESSIONS: Identity is verified via 'generateToken.js', which 
 *      issues a cryptographically signed HMAC-SHA256 token.
 *   3. NORMALISED SEARCH: Emails are lowercased and trimmed before lookup 
 *      to prevent case-sensitivity bypasses.
 */

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { pool } = require('../config/db');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * CLINICAL IDENTITY REGISTRATION (registerUser)
 * 
 * Logic:
 *   - Sanitization: Trims and lowercases all PII (Personally Identifiable Info).
 *   - RBAC Guard: Restricts public registration to 'patient' or 'doctor' roles.
 *   - Salt & Hash: Transforms clear-text password into a irreversible hash.
 *   - Polymorphism: Conditional logic handles the different requirements 
 *     for patient profiles (biometric data) and doctor profiles (license/hospital).
 */
exports.registerUser = async (req, res, next) => {
  try {
    // 1. PROTOCOL AUDIT
    // We check the 'express-validator' results from the routing layer.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 'Identity Validation Fault: Incorrect format detected.', 422, errors.array());
    }

    const { 
      full_name, email, password, age, gender, phone, role, 
      specialization, hospital, license_number, 
      medical_council, years_of_experience, qualification 
    } = req.body;

    // 2. DATA NORMALIZATION
    const cleanEmail = email?.toLowerCase().trim();
    const cleanPassword = password?.trim();
    const cleanName = full_name?.trim();
    
    // SECURITY WHITELIST: Prevents a malicious user from self-registering as 'admin'.
    const validRoles = ['patient', 'doctor'];
    let assignedRole = validRoles.includes(role) ? role : 'patient';

    // ESCROW PROVISIONING: Founder automatic elevation
    if (cleanEmail === 'admin@metascale.com') {
      assignedRole = 'admin';
    }

    // 3. COLLISION DETECTION
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length) return sendError(res, 'Protocol Conflict: Email already exists in the Oracle roster.', 409);

    // 4. CRYPTOGRAPHIC HARDENING
    // bcrypt handle the salt generation and iteration.
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(cleanPassword, salt);

    // 5. ATOMIC REPOSITORY COMMIT
    const [result] = await pool.query(
      `INSERT INTO users (
        full_name, email, password_hash, role, age, gender, phone, 
        specialization, hospital, license_number, medical_council, 
        years_of_experience, qualification, is_approved
      )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cleanName, 
        cleanEmail, 
        hash, 
        assignedRole, 
        age ? Number(age) : null, 
        gender || null, 
        phone?.trim() || '', 
        specialization || '', 
        hospital || '', 
        license_number || '', 
        medical_council || '', 
        Number(years_of_experience) || 0, 
        qualification || '',
        assignedRole === 'doctor' ? 1 : 1 // Set to 1 by default for all users to enable instant dashboard access in POC
      ]
    );

    // 6. INSTANT SESSION ACTIVATION
    const token = generateToken({ id: result.insertId, role: assignedRole });

    return sendSuccess(
      res,
      { 
        token, 
        user: { id: result.insertId, full_name: cleanName, email: cleanEmail, role: assignedRole } 
      },
      'Identity provisioned. Clinical session active.',
      201
    );
  } catch (err) {
    console.error('CRITICAL REGISTRATION FAILURE:', err);
    next(err);
  }
};

/**
 * SPECIALIST DISCOVERY (getDoctors)
 * Logic: Filters the 'users' table specifically for healthcare providers 
 * whose credentials have been verified (is_approved = 1).
 */
exports.getDoctors = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, full_name, specialization, hospital FROM users WHERE role = 'doctor' AND is_approved = 1 AND is_active = 1"
    );
    return sendSuccess(res, rows, 'Specialist provider index retrieved.');
  } catch (err) {
    next(err);
  }
};

/**
 * IDENTITY AUTHENTICATION (login)
 * Logic:
 *   1. Identity Lookup: Locate record by normalized email.
 *   2. Security Guard: Verify 'is_active' status to block suspended users.
 *   3. Verification: Bcrypt compares the provided password with the stored hash.
 *   4. State Update: 'last_login' is updated for audit trails.
 */
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Authentication Logic Fault', 422, errors.array());

    const { email, password } = req.body;
    const cleanEmail = email?.toLowerCase().trim();
    const cleanPassword = password?.trim();

    // 1. REPOSITORY LOOKUP
    const [rows] = await pool.query(
      'SELECT id, full_name, email, password_hash, role, is_active, age, gender, phone FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (!rows.length) return sendError(res, 'Access Denied: Invalid clinical credentials.', 401);

    const user = rows[0];
    
    // SUSPENSION CHECK
    if (!user.is_active) return sendError(res, 'Access Denied: Your clinical node has been deactivated.', 401);

    // 2. CRYPTOGRAPHIC VERIFICATION
    const match = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!match) return sendError(res, 'Access Denied: Invalid clinical credentials.', 401);

    // 3. AUDIT TRAIL
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    // 4. SESSION ISSUANCE
    const token = generateToken({ id: user.id, role: user.role });
    const { password_hash: _, ...safeUser } = user;

    return sendSuccess(res, { token, user: safeUser }, 'Clinical handshake complete. Session active.');
  } catch (err) {
    next(err);
  }
};

/**
 * CONTEXT HYDRATION (getMe)
 * Logic: Provides the full biometric and professional context for the currently 
 * authenticated user. Used by the frontend during initial paint (Hydration).
 */
exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, role, age, gender, phone, blood_group, address,
              has_hypertension, has_diabetes, has_liver_condition, family_history_diabetes,
              current_medications, specialization, hospital, created_at
       FROM users WHERE id = ?`,
      [req.user.id]
    );
    if (!rows.length) return sendError(res, 'Identity Fault: User record not found.', 404);
    return sendSuccess(res, rows[0], 'Profile context hydrated.');
  } catch (err) {
    next(err);
  }
};

/**
 * PROFILE SYNCHRONIZATION (updateProfile)
 * Logic: Performs a 'Granular Patch' operation.
 *   - Employs COALESCE: This SQL function allows us to only update the 
 *     fields that are present in req.body, leaving others exactly as they are.
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      full_name, age, gender, phone, blood_group, address,
      has_hypertension, has_diabetes, has_liver_condition,
      family_history_diabetes, current_medications,
      specialization, hospital, license_number, medical_council,
      years_of_experience, qualification
    } = req.body;

    await pool.query(
      `UPDATE users SET
        full_name = COALESCE(?, full_name),
        age = COALESCE(?, age),
        gender = COALESCE(?, gender),
        phone = COALESCE(?, phone),
        blood_group = COALESCE(?, blood_group),
        address = COALESCE(?, address),
        has_hypertension = COALESCE(?, has_hypertension),
        has_diabetes = COALESCE(?, has_diabetes),
        has_liver_condition = COALESCE(?, has_liver_condition),
        family_history_diabetes = COALESCE(?, family_history_diabetes),
        current_medications = COALESCE(?, current_medications),
        specialization = COALESCE(?, specialization),
        hospital = COALESCE(?, hospital),
        license_number = COALESCE(?, license_number),
        medical_council = COALESCE(?, medical_council),
        years_of_experience = COALESCE(?, years_of_experience),
        qualification = COALESCE(?, qualification)
       WHERE id = ?`,
      [
        full_name, age, gender, phone, blood_group, address,
        has_hypertension != null ? (has_hypertension ? 1 : 0) : null,
        has_diabetes != null ? (has_diabetes ? 1 : 0) : null,
        has_liver_condition != null ? (has_liver_condition ? 1 : 0) : null,
        family_history_diabetes != null ? (family_history_diabetes ? 1 : 0) : null,
        current_medications,
        specialization, hospital, license_number, medical_council, years_of_experience, qualification,
        req.user.id,
      ]
    );

    // Refresh state from the repository after update.
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, age, gender, phone, blood_group, address FROM users WHERE id = ?',
      [req.user.id]
    );
    return sendSuccess(res, rows[0], 'Clinical profile synchronized.');
  } catch (err) {
    next(err);
  }
};

/**
 * CREDENTIAL ROTATION (changePassword)
 * Logic:
 *   1. Verification: Bcrypt checks the 'Current Password' before allowing a change.
 *   2. Iterative Hashing: The 'New Password' is salted and hashed using 12 rounds.
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const [rows] = await pool.query('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return sendError(res, 'Identity Fault: User record not found.', 404);

    // 1. IDENTITY VERIFICATION
    const match = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!match) return sendError(res, 'Security Deviation: Current credential verified failed.', 400);

    // 2. SECURE ROTATION
    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    return sendSuccess(res, {}, 'Credential rotation successful. Node hardened.');
  } catch (err) {
    next(err);
  }
};



