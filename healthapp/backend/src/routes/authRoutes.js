/**
 * METASCALE HEALTH: IDENTITY & PERIMETER GATEWAY (authRoutes.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This router serves as the 'Network Perimeter' for identity-related traffic. 
 * It defines the entry points for credentials and session management.
 * 
 * ─── SECURITY TOPOLOGY: THE MIDDLEWARE CHAIN ────────────────────────────────
 * Every request passing through this router follows a standardized 'Trust Chain':
 *   1. VALIDATION: 'express-validator' inspects the raw payload for schema 
 *      conformity (Email format, Password length).
 *   2. GUARDING: The 'protect' middleware (JWT) verifies the HMAC signature 
 *      of the session token for restricted endpoints.
 *   3. EXECUTION: The 'authController' performs the final repository commit 
 *      or retrieval.
 * 
 * ─── ENDPOINT DISPATCH ──────────────────────────────────────────────────────
 * Namespacing: Mounted at /api/auth in app.js.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { body } = require('express-validator');

// ─── STAGE 1: ANONYMOUS ENTRY (No Token Required) ──────────────────────────

/**
 * IDENTITY PROVISIONING (POST /register)
 * 
 * Logic:
 *   - Schema Enforcement: Mandatory 'full_name', 'email' (canonicalized), 
 *     and 'password' (min 6 chars).
 *   - Workflow: Used by both patients and doctors to create an account.
 *   - Result: Returns a 201 Created and an immediate session token.
 */
router.post('/register', [
  body('full_name').notEmpty().withMessage('Full identity marker is required.'),
  body('email').isEmail().withMessage('Valid clinical email format required.'),
  body('password').isLength({ min: 6 }).withMessage('Access key requires minimum 6 characters of entropy.')
], authController.registerUser);

/**
 * SESSION INITIATION (POST /login)
 * 
 * Logic:
 *   - Identification: Cross-references the provided email with the oracle.
 *   - Audit: Triggers a 'last_login' timestamp update on success.
 *   - Result: Issues a signed JWT for subsequent platform operations.
 */
router.post('/login', [
  body('email').isEmail().withMessage('Valid clinical identifier required.'),
  body('password').notEmpty().withMessage('Access key must be provided.')
], authController.login);

// ─── STAGE 2: AUTHENTICATED OPERATIONS (Protect Hook Active) ───────────────
// All endpoints below this line require a valid 'Authorization: Bearer <TOKEN>' header.

/**
 * SPECIALIST DIRECTORY (GET /doctors)
 * Purpose: Retrieves the index of 'Approved' healthcare providers.
 */
router.get('/doctors', protect, authController.getDoctors);

/**
 * PROFILE HYDRATION (GET /me)
 * Purpose: Fetches the full biometric/professional context for the current node.
 */
router.get('/me', protect, authController.getMe);

/**
 * BIOMETRIC SYNCRONIZATION (PUT /update)
 * Purpose: Allows the user to 'Patch' their clinical or demographics fields.
 */
router.put('/update', protect, authController.updateProfile);

/**
 * CREDENTIAL ROTATION (PUT /change-password)
 * Purpose: High-security rotation of the session access key.
 */
router.put('/change-password', protect, authController.changePassword);

module.exports = router;



