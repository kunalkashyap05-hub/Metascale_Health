/**
 * METASCALE HEALTH: DIAGNOSTIC & ML ORCHESTRATOR (predictionController.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This controller acts as the 'Clinical Processing Engine'. It sits between 
 * the patient portal's input forms and our specialized ML models.
 * 
 * ─── DIAGNOSTIC ORCHESTRATION PATTERN ───────────────────────────────────────
 *   1. NORMALIZATION: Raw inputs (which may be strings or decimals) are 
 *      converted into precise numerical physiological feature vectors.
 *   2. ML INFERENCE: These vectors are passed to domain-specific services 
 *      (Liver/Diabetes) which return a risk-band and interpreted insight.
 *   3. PERSISTENCE: Every screening is logged with its full feature context, 
 *      allowing doctors to perform retrospective audits of the patient's biometrics.
 * 
 * ─── LONGITUDINAL HISTORY STRATEGY ──────────────────────────────────────────
 * Instead of a single 'screenings' table, we use domain-specific tables 
 * (liver_screenings, diabetes_screenings) for better schema hygiene. 
 * 'getHistory' interleaves these records into a single temporal stream for 
 * the patient.
 */

const { validationResult } = require('express-validator');
const { pool } = require('../config/db');
const liverSvc = require('../services/liverPredictionService');
const diabetesSvc = require('../services/diabetesPredictionService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * LIVER DIAGNOSTIC PIPELINE (submitLiver)
 * 
 * Logic:
 *   - Physiological Filtering: Ensures that biomarkers (Bilirubin, 
 *     Transaminases) are within valid ranges specified in the routing layer.
 *   - Vector Mapping: Converts human-readable inputs into the exact format 
 *     expected by the Liver Prediction Model.
 *   - Insight Retrieval: The model returns a 'risk_band' (Minimal/Elevated/etc.) 
 *     and a cluster of medical recommendations.
 *   - Audit Commit: Stores the biometrics and the AI interpretation.
 */
exports.submitLiver = async (req, res, next) => {
  try {
    // 1. PROTOCOL AUDIT
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Clinical Data Integrity Fault: Biomarkers out of range.', 422, errors.array());

    // 2. EXTRACTION & NORMALIZATION
    const {
      age, gender,
      totalBilirubin, directBilirubin,
      alkalinePhosphotase, alamineAminotransferase, aspartateAminotransferase,
      totalProteins, albumin, albuminGlobulinRatio,
      alcoholPattern, priorLiverDiagnosis, liverTestResult,
    } = req.body;

    // Feature Object: The 'Feature Vector' required for diagnostic inference.
    const features = {
      age: Number(age),
      gender,
      totalBilirubin: Number(totalBilirubin),
      directBilirubin: Number(directBilirubin),
      alkalinePhosphotase: Number(alkalinePhosphotase),
      alamineAminotransferase: Number(alamineAminotransferase),
      aspartateAminotransferase: Number(aspartateAminotransferase),
      totalProteins: Number(totalProteins),
      albumin: Number(albumin),
      albuminGlobulinRatio: Number(albuminGlobulinRatio),
      alcoholPattern: alcoholPattern || 'none',
      priorLiverDiagnosis: !!priorLiverDiagnosis,
      liverTestResult: liverTestResult || 'notsure',
    };

    // 3. SPECIALIZED INFERENCE
    // Orchestrates the Liver ML engine to calculate risk coefficients.
    const result = await liverSvc.predict(features);

    // 4. ATOMIC CLINICAL COMMIT
    // Persistence mapping to the 'liver_screenings' repository.
    const [dbResult] = await pool.query(
      `INSERT INTO liver_screenings
       (user_id, age, gender, total_bilirubin, direct_bilirubin,
        alkaline_phosphotase, alamine_aminotransferase, aspartate_aminotransferase,
        total_proteins, albumin, albumin_globulin_ratio,
        alcohol_pattern, prior_liver_diagnosis, liver_test_result,
        prediction, confidence, risk_band, interpretation, recommendations)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id, features.age, features.gender,
        features.totalBilirubin, features.directBilirubin,
        features.alkalinePhosphotase, features.alamineAminotransferase,
        features.aspartateAminotransferase, features.totalProteins,
        features.albumin, features.albuminGlobulinRatio,
        features.alcoholPattern,
        features.priorLiverDiagnosis ? 1 : 0,
        features.liverTestResult,
        result.prediction, result.confidence, result.riskBand,
        result.interpretation,
        JSON.stringify(result.recommendations),
      ]
    );

    return sendSuccess(
      res,
      { id: dbResult.insertId, ...result, features },
      'Liver screening finalized and audit generated.',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * METABOLIC RISK PIPELINE (submitDiabetes)
 * Logic: Similar to Liver, but focuses on Metabolic Markers (BMI, Sleep, Stress).
 * Data Pattern: Uses 'DiabetesPredictionService' for inference clustering.
 */
exports.submitDiabetes = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 'Metabolic Data Integrity Fault.', 422, errors.array());

    const {
      ageGroup, gender, familyDiabetes, highBP, physicallyActive, bmi,
      smoking, alcohol, sleepHours, soundSleep, regularMedicine, junkFood,
      stress, bpLevel, pregnancies, prediabetes, urinationFreq,
    } = req.body;

    // FEATURE SYNTHESIS
    const features = {
      ageGroup, gender,
      familyDiabetes: !!familyDiabetes,
      highBP: !!highBP,
      physicallyActive: physicallyActive || 'none',
      bmi: Number(bmi) || 22,
      smoking: !!smoking,
      alcohol: !!alcohol,
      sleepHours: Number(sleepHours) || 7,
      soundSleep: Number(soundSleep) || 6,
      regularMedicine: !!regularMedicine,
      junkFood: junkFood || 'rarely',
      stress: stress || 'none',
      bpLevel: bpLevel || 'normal',
      pregnancies: Number(pregnancies) || 0,
      prediabetes: !!prediabetes,
      urinationFreq: urinationFreq || 'notMuch',
    };

    // 3. SPECIALIZED INFERENCE
    const result = await diabetesSvc.predict(features);

    // ─── REPOSITORY COMMIT ────────────────────────────────────────────────
    const [dbResult] = await pool.query(
      `INSERT INTO diabetes_screenings
       (user_id, age_group, gender, family_diabetes, high_bp, physically_active,
        bmi, smoking, alcohol, sleep_hours, sound_sleep, regular_medicine,
        junk_food, stress, bp_level, pregnancies, prediabetes, urination_freq,
        prediction, confidence, risk_band, interpretation, recommendations)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user.id, features.ageGroup, features.gender,
        features.familyDiabetes ? 1 : 0, features.highBP ? 1 : 0,
        features.physicallyActive, features.bmi,
        features.smoking ? 1 : 0, features.alcohol ? 1 : 0,
        features.sleepHours, features.soundSleep,
        features.regularMedicine ? 1 : 0, features.junkFood,
        features.stress, features.bpLevel,
        features.pregnancies, features.prediabetes ? 1 : 0,
        features.urinationFreq,
        result.prediction, result.confidence, result.riskBand,
        result.interpretation, JSON.stringify(result.recommendations),
      ]
    );

    return sendSuccess(
      res,
      { id: dbResult.insertId, ...result, features },
      'Diabetes screening finalized. Metabolic vector saved.',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * LONGITUDINAL HISTORY STREAM (getHistory)
 * 
 * Logic:
 *   - Aggregation: Performs asynchronous retrieval from both Liver and 
 *     Diabetes repositories.
 *   - Normalization: Adds a 'type' discriminator to each record.
 *   - Interleaving: Merges both arrays and sorts them by 'created_at' in 
 *     descending order to provide a chronological health timeline.
 */
exports.getHistory = async (req, res, next) => {
  try {
    // SECURITY: Patients can only hit their own history. 
    // Doctors provide a 'userId' parameter.
    const userId = req.user.role === 'patient' ? req.user.id : req.params.userId;
    const { type } = req.query;

    let liverRows = [], diabetesRows = [];

    // 1. DATA PULL
    if (!type || type === 'liver') {
      [liverRows] = await pool.query(
        `SELECT id, 'liver' AS type, prediction, confidence, risk_band, interpretation,
                recommendations, is_reviewed, doctor_flag, created_at
         FROM liver_screenings WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
    }

    if (!type || type === 'diabetes') {
      [diabetesRows] = await pool.query(
        `SELECT id, 'diabetes' AS type, prediction, confidence, risk_band, interpretation,
                recommendations, is_reviewed, doctor_flag, created_at
         FROM diabetes_screenings WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
    }

    // 2. TEMPORAL SORTING & SANITIZATION
    const combined = [...liverRows, ...diabetesRows]
      .map((r) => ({
        ...r,
        risk_band: r.risk_band || 'Unknown',
        confidence: r.confidence || 0,
        recommendations: typeof r.recommendations === 'string' ? JSON.parse(r.recommendations) : (r.recommendations || []),
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return sendSuccess(res, combined, 'Longitudinal health timeline synchronized.');
  } catch (err) {
    next(err);
  }
};

/**
 * DIAGNOSTIC DETAIL PROBE (getScreeningDetail)
 * Logic: Retrieves the specific feature vector and raw metrics for a 
 * single screening event, used for deep clinical audit.
 */
exports.getScreeningDetail = async (req, res, next) => {
  try {
    const { id, type } = req.params;
    const table = type === 'liver' ? 'liver_screenings' : 'diabetes_screenings';

    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    if (!rows.length) return sendError(res, 'Audit Fault: Diagnostic event record unavailable.', 404);

    const record = rows[0];

    // ISOLATION GUARD: Prevents patients from accessing other patients' data.
    if (req.user.role === 'patient' && record.user_id !== req.user.id) {
      return sendError(res, 'Authorization Violation: Critical isolation breach attempted.', 403);
    }

    if (typeof record.recommendations === 'string') {
      record.recommendations = JSON.parse(record.recommendations);
    }

    return sendSuccess(res, record, 'Diagnostic feature context retrieved.');
  } catch (err) {
    next(err);
  }
};



