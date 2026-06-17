/**
 * METASCALE HEALTH: DIAGNOSTIC & AI ORCHESTRATION ROUTER (predictionRoutes.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This router acts as the 'Gateway to Intelligence' for the Clinical OS. 
 * It defines the endpoints for metabolic risk assessment, longitudinal 
 * diagnostic history, and AI-driven clinical synthesis (LLM explanations).
 * 
 * ─── DIAGNOSTIC ORCHESTRATION ───────────────────────────────────────────────
 * The routes here facilitate a complex multi-step pipeline:
 *   1. INGESTION: Biological markers (Liver/Diabetes) are received.
 *   2. INFERENCE: Decoupled ML services calculate risk coefficients.
 *   3. SYNTHESIS: Large Language Models (Gemini) are optionally invoked 
 *      to explain the 'What and Why' of a diagnostic outcome.
 * 
 * ─── SECURITY TOPOLOGY: TIERED PRIVACY ──────────────────────────────────────
 *   - Patients: Granted 'Self-Audit' access—only seeing their own history.
 *   - Practitioners (Doctor/Admin): Granted 'Delegated Audit' access—allowing 
 *     them to view patient records for medical oversight.
 */

const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const clinicalInsightSvc = require('../services/clinicalInsightService');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { body } = require('express-validator');

// ─── STAGE 1: METABOLIC SCREENING PIPELINES ────────────────────────────────

/**
 * LIVER DIAGNOSTIC ENDPOINT (POST /liver)
 * 
 * Logic:
 *   - Vector: Enforces hepatic biomarkers (Bilirubin, ALP, ALT, AST).
 *   - Guard: Patient-only self-screening.
 *   - Outcome: Preliminary AI risk-band (Minimal to Severe).
 */
router.post('/liver', [
  protect,
  authorize('patient'),
  body('age').isNumeric().withMessage('Age marker must be numerical.'),
  body('gender').notEmpty().withMessage('Biological gender is required.'),
  body('totalBilirubin').isNumeric().withMessage('Total Bilirubin marker mandatory.'),
  body('directBilirubin').isNumeric().withMessage('Direct Bilirubin marker mandatory.'),
  body('alkalinePhosphotase').isNumeric().withMessage('ALP marker mandatory.'),
  body('alamineAminotransferase').isNumeric().withMessage('ALT marker mandatory.'),
  body('aspartateAminotransferase').isNumeric().withMessage('AST marker mandatory.')
], predictionController.submitLiver);

/**
 * DIABETES METABOLIC AUDIT (POST /diabetes)
 * 
 * Logic:
 *   - Vector: Lifestyle + Physiological clusters (BMI, Family History, Activity).
 *   - Guard: Patient-only self-screening.
 */
router.post('/diabetes', [
  protect,
  authorize('patient'),
  body('ageGroup').notEmpty().withMessage('Age group classification is required.'),
  body('gender').notEmpty().withMessage('Biological gender is required.'),
  body('bmi').isNumeric().withMessage('BMI (Body Mass Index) must be a number.')
], predictionController.submitDiabetes);

// ─── STAGE 2: LONGITUDINAL AUDIT & ARCHIVE ──────────────────────────────────

/**
 * SELF-AUDIT ARCHIVE (GET /history)
 * Purpose: Retrieves the temporal health timeline for the requesting patient.
 */
router.get('/history', protect, predictionController.getHistory);

/**
 * DELEGATED CLINICAL AUDIT (GET /history/:userId)
 * Purpose: Enables healthcare providers to review a specific patient's timeline.
 * Access: Doctor or Admin identities only.
 */
router.get('/history/:userId', protect, authorize('doctor', 'admin'), predictionController.getHistory);

/**
 * GRANULAR EVENT DETAIL (GET /detail/:type/:id)
 * Purpose: Probes the raw biometric feature vector for a single screening event.
 */
router.get('/detail/:type/:id', protect, predictionController.getScreeningDetail);

// ─── STAGE 3: AI CLINICAL SYNTHESIS (LLM) ───────────────────────────────────

/**
 * DIAGNOSTIC SYNTHESIS (POST /explain)
 * 
 * Logic:
 *   - Logic: Passes raw diagnostic data + AI results to Gemini.
 *   - Outcome: A human-centric explanation of clinical markers for patient clarity.
 */
router.post('/explain', protect, async (req, res, next) => {
  try {
    const { type, data, result } = req.body;
    const explanation = await clinicalInsightSvc.explainScreening(type, data, result);
    return sendSuccess(res, { explanation }, 'Clinical synthesis generated via Gemini.');
  } catch (err) {
    next(err);
  }
});

module.exports = router;



