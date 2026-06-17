/**
 * METASCALE HEALTH: ROLE-BASED ACCESS CONTROL (RBAC) (roleMiddleware.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This utility acts as the 'Internal Guard' for the Clinical OS. 
 * While authMiddleware verifies WHO the user is, this middleware verifies 
 * WHAT they are allowed to do.
 * 
 * ─── THE CLOSURE FACTORY PATTERN ────────────────────────────────────────────
 * This is a 'Higher-Order Function' that returns a standard Express middleware.
 *   1. FACTORY PHASE: Takes a variadic list of strings (e.g., 'admin', 'doctor').
 *   2. EXECUTION PHASE: When a request hits the route, the generated 
 *      middleware checks 'req.user.role' (injected by protect.js) against 
 *      the provided whitelist.
 * 
 * ─── SECURITY FEEDBACK: 403 vs 401 ──────────────────────────────────────────
 *   - 401 (Unauthorized): You don't have a valid ID card.
 *   - 403 (Forbidden): You have a valid ID card, but you aren't allowed in 
 *     this specific room (e.g., a Patient trying to access the Admin dashboard).
 */

const { sendError } = require('../utils/apiResponse');

/**
 * AUTHORIZATION GUARD FACTORY
 * @param  {...string} roles - The whitelist of permitted clinical roles.
 * @returns {Function} - An Express middleware function.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // 1. WHITELIST VALIDATION
    // PARITY CHECK: Does the user's role exist in the allowed tier list?
    if (!roles.includes(req.user.role)) {
      
      // 2. FORMAL DENIAL (403 Forbidden)
      // Provides clear physiological feedback concerning the access restriction.
      return sendError(
        res,
        `Access Violation: '${req.user.role}' identity detected. This module requires [${roles.join(', ')}] clearance.`,
        403
      );
    }

    // 3. CLEARANCE GRANTED
    next();
  };
};

module.exports = authorize;


