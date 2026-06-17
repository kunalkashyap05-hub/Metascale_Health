/**
 * METASCALE HEALTH: IDENTITY VERIFICATION GATEWAY (authMiddleware.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This middleware acts as the 'Primary Sentry' for the Clinical OS. 
 * it intercepts every request to protected routes to verify the 
 * legitimacy of the requester's identity.
 * 
 * ─── THE BEARER HANDSHAKE ───────────────────────────────────────────────────
 * We implement the 'Bearer Token' pattern:
 *   1. EXTRACTION: Pulls the JWT from the 'Authorization' header.
 *   2. DECRYPTION: Uses the system-wide 'JWT_SECRET' to verify the 
 *      HMAC signature and extract the User ID (payload).
 *   3. DB-STATE SYNC (CRITICAL): Unlike 'Stateless JWT' models, we perform 
 *      a 'Stateful Verification' against the database on every request. 
 *      This ensures that suspended or deleted accounts cannot use 
 *      pre-existing tokens to access data.
 * 
 * ─── SECURITY RECOVERY ──────────────────────────────────────────────────────
 * It handles specific JWT fault conditions (Expiry, Malformation) to 
 * provide clear signals to the frontend Context providers.
 */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/apiResponse');
const { pool } = require('../config/db');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. EXTRACTION: Identify the token signature in the header pipeline.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Guard: Prevent unauthorized access if no credential is found.
    if (!token) {
      return sendError(res, 'Authorization failed: Missing or malformed token.', 401);
    }

    // 2. CRYPTOGRAPHIC VERIFICATION
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. INTEGRITY SYNC: Contextual Re-verification
    // We check 'is_active' to prevent a 'Ghost Session' after account suspension.
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!rows.length || !rows[0].is_active) {
      return sendError(res, 'Session terminated: Account de-activated.', 401);
    }

    // 4. CONTEXT INJECTION: Hydrates 'req.user' for downstream controllers.
    req.user = rows[0];
    next();
  } catch (err) {
    // Standardized JWT Fault Handling
    if (err.name === 'JsonWebTokenError') return sendError(res, 'Integrity Check Failed: Invalid signature.', 401);
    if (err.name === 'TokenExpiredError') return sendError(res, 'Session Expired: Re-authentication required.', 401);
    next(err);
  }
};

module.exports = protect;


