/**
 * METASCALE HEALTH: API RESPONSE ARCHITECTURE (apiResponse.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This utility serves as the 'Outbound Normalizer' for the Clinical OS. 
 * It ensures that every single response dispatched by the backend follows 
 * a rigid, predictable JSON schema.
 * 
 * ─── UNIFORM SCHEMA PATTERN ─────────────────────────────────────────────────
 * By wrapping all responses in these dispatchers, we guarantee the following 
 * handshake with the frontend (React):
 *   1. success: A boolean indicating the operational outcome (true/false).
 *   2. message: A human-centric clinical description of the event.
 *   3. data/errors: A payload for successful reads or an array of validation 
 *      faults for failures.
 * 
 * ─── SEMANTIC CONSISTENCY ───────────────────────────────────────────────────
 * These helpers enforce the use of proper HTTP status codes, allowing 
 * network-level intermediaries (Proxies, Load Balancers) to correctly 
 * categorize traffic health.
 */

/**
 * SUCCESS DISPATCHER (sendSuccess)
 * 
 * Logic:
 *   - Tier: Standardizes HTTP 200 (OK) and 201 (Created) flows.
 *   - Payload: Consistently nests data within the 'data' key to simplify 
 *     frontend state hydration.
 */
const sendSuccess = (res, data = {}, message = 'Operation finalized.', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

/**
 * FAULT DISPATCHER (sendError)
 * 
 * Logic:
 *   - Tier: Handles HTTP 4xx (Client) and 5xx (Server) flows.
 *   - Sanitization: Provides a structured 'errors' array specifically for 
 *     express-validator payloads, enabling granular UI form feedback.
 */
const sendError = (res, message = 'Fatal clinical exception.', statusCode = 500, errors = null) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  res.status(statusCode).json(body);
};

module.exports = { sendSuccess, sendError };


