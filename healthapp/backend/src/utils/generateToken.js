/**
 * METASCALE HEALTH: IDENTITY SIGNING ENGINE (generateToken.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This utility serves as the 'Credential Factory' for the Clinical OS. 
 * it transforms internal user identities into secure, cryptographic strings 
 * (JWTs) that allow patients and doctors to navigate the platform.
 * 
 * ─── CRYPTOGRAPHIC SIGNING PATTERN ──────────────────────────────────────────
 * We utilize HMAC SHA256 for token generation:
 *   1. IDENTITY PACKAGING: We encapsulate only the 'Minimum Viable Identity' 
 *      (User ID and Role) in the payload. This prevents sensitive PII leakage 
 *      within the base64-encoded token body.
 *   2. SYSTEM SECRET: The signature is hashed using a private 'JWT_SECRET' 
 *      stored in the environmental vault.
 *   3. TEMPORAL PERSISTENCE: Tokens are issued with a 7-day 'Life Expectancy' 
 *      by default, balancing user convenience with security rotation.
 * 
 * ─── TOKEN ARCHITECTURE ─────────────────────────────────────────────────────
 * Every token generated here is verifiable by the 'protect' middleware in 
 * authMiddleware.js.
 */

const jwt = require('jsonwebtoken');

/**
 * TOKEN GENERATOR
 * @param {Object} payload - Usually contains { id, role }
 * @returns {String} - A signed JSON Web Token.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    // SECURITY CONFIGURATION: Expiry window control.
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;


