/**
 * METASCALE HEALTH: SYSTEM GOVERNANCE & ADMIN ROUTER (adminRoutes.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This router serves as the 'Command Center' for the Platform Administrator. 
 * It exposes high-privilege endpoints required for managing system integrity, 
 * provider verification, and ecosystem analytics.
 * 
 * ─── GOVERNANCE PROTOCOLS ───────────────────────────────────────────────────
 *   1. PRACTITIONER VERIFICATION: Implements the 'Zero-Trust' gate where 
 *      admins must verify and approve doctor identities before they gain 
 *      clinical review privileges.
 *   2. SYSTEMIC TELEMETRY: Aggregates multidimensional data across patients, 
 *      doctors, and screenings to inform platform-wide decision making.
 *   3. IDENTITY NODES CONTROL: Provides the 'Circuit Breaker' mechanism 
 *      to suspend or activate user accounts in response to clinical or 
 *      security events.
 * 
 * ─── SECURITY TOPOLOGY ──────────────────────────────────────────────────────
 *   - Exclusive Access: Every endpoint is guarded by 'authorize(admin)' to 
 *     prevent unauthorized access to infrastructure-level controls.
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// ─── STAGE 1: PROVIDER GOVERNANCE ──────────────────────────────────────────

/**
 * SPECIALIST AUDIT QUEUE (GET /doctors)
 * 
 * Purpose: Retrieves the registry of healthcare practitioners.
 * Logic: Used to monitor doctor onboarding and professional calibration.
 */
router.get('/doctors', protect, authorize('admin'), adminController.getDoctors);

/**
 * PROFESSIONAL VERIFICATION (PUT /doctors/:id/approve)
 * 
 * Logic:
 *   - Mutation: Sets 'is_approved' to 1 for the specific doctor ID.
 *   - Impact: Activates professional clinical review capabilities for the node.
 */
router.put('/doctors/:id/approve', protect, authorize('admin'), adminController.approveDoctor);

// ─── STAGE 2: PLATFORM-WIDE TELEMETRY & CONTROL ─────────────────────────────

/**
 * SYSTEMIC TELEMETRY (GET /analytics)
 * 
 * Purpose: Provides a high-fidelity view of screening trends and population statistics.
 */
router.get('/analytics', protect, authorize('admin'), adminController.getSystemAnalytics);

/**
 * IDENTITY NODES CONTROL (PUT /users/:id/status)
 * 
 * Purpose: The manual 'Override' for account activation status.
 * Use Case: Suspending accounts during investigations OR re-activating nodes.
 */
router.put('/users/:id/status', protect, authorize('admin'), adminController.toggleUserStatus);

module.exports = router;



