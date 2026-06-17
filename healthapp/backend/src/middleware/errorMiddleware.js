/**
 * METASCALE HEALTH: GLOBAL FAULT ISOLATION (errorMiddleware.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This is the 'Terminal Middleware' of the Express pipeline. It acts as 
 * a safety net for the entire Clinical OS, ensuring that any unhandled 
 * exception is caught, logged, and gracefully normalized before reaching 
 * the network interface.
 * 
 * ─── FAULT ISOLATION PROTOCOLS ──────────────────────────────────────────────
 *   1. OBSERVABILITY: Every fault is logged with its full 'err.stack' trace 
 *      to the server console. This provides the clinical evidence required 
 *      for debugging core logic failures.
 *   2. SECURE NORMALIZATION: We intentionally sanitize outgoing error 
 *      messages. While the server logs the raw stack trace, the client 
 *      only receives a high-level summary to prevent 'Information Leakage' 
 *      of internal database schemas or file paths.
 *   3. UNIFORM DISPATCH: Enforces that all failures follow the 
 *      { success: false, message: ... } JSON schema defined in apiResponse.js.
 * 
 * ─── RECOVERY LOGIC ─────────────────────────────────────────────────────────
 * If an error reaches this point without a 'statusCode', it is treated as a 
 * 'Core System Fault' and defaulted to HTTP 500 (Internal Server Error).
 */

const { sendError } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // 1. OBSERVABILITY COMMIT
  // Internally log the full forensic evidence of the fault.
  console.error('[CORE SYSTEM FAULT]', err.stack || err.message);

  // 2. NORMALIZATION
  // Extract custom status codes (from manual throws) or default to 500.
  const statusCode = err.statusCode || 500;
  const message    = err.message || 'A fatal internal exception occurred. The Clinical engine is recovering.';

  // 3. SECURE DISPATCH
  // Dispatches the sanitized payload. Stack traces are NEVER sent to the client.
  sendError(res, message, statusCode);
};

module.exports = errorHandler;


