const { runInference } = require('../utils/mlEngine');

/**
 * EMERGENCY: HEURISTIC SAFETY UNDERLAY (_heuristicFallback)
 * Ensures a working report if the metabolic ML engine fails to spawn.
 */
const _heuristicFallback = (features) => {
  let score = 20;
  if (features.familyDiabetes) score += 15;
  if (features.highBP) score += 10;
  if (parseFloat(features.bmi) >= 30) score += 14;
  if (features.prediabetes) score += 15;

  const prob = Math.min(score, 90) / 100;
  return {
    probability: prob,
    prediction: prob > 0.5 ? "Diabetic" : "Not Diabetic"
  };
};

/**
 * INTERNAL: TIER CLASSIFICATION
 */
const _toRiskLabel = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Low';
  if (score < 50) return 'Moderate';
  if (score < 75) return 'High';
  return 'Very High';
};

const _toRiskBand = (prob) => {
  const score = prob * 100;
  if (score < 25) return 'Minimal';
  if (score < 50) return 'Elevated';
  if (score < 75) return 'Severe';
  return 'Critical';
};

const _interpretation = (label) => {
  const map = {
    Low:         'Metabolic indicators suggest low immediate risk. Maintain your current active profile.',
    Moderate:    'Modifiable risk factors detected. Focus on incremental dietary and activity adjustments.',
    High:        'Risk vectors are elevated. A clinical blood glucose (Fasting/HbA1c) audit is recommended.',
    'Very High': 'Profile suggests high metabolic stress. Immediate specialist consultation is required.',
  };
  return map[label];
};

const _recommendations = (features, label) => {
  const recs = [];
  if (['High', 'Very High'].includes(label)) {
    recs.push('Consult an Endocrinologist for an HbA1c diagnostic benchmark.');
  }
  recs.push('Maintain healthy metabolic habits.');
  return recs;
};

/**
 * PUBLIC EXPORT: DIABETES PREDICTION ORCHESTRATOR (predict)
 * 
 * Zero-Failure Protocol:
 *   - Primary: ML (Random Forest)
 *   - Fallback: Heuristic Safety Net
 */
const predict = async (features) => {
  let result;
  let engineType = 'machine-learning';

  // Sanitize
  const sanitized = {
    ageGroup: features.ageGroup || '40-49',
    gender: String(features.gender || 'male').toLowerCase(),
    familyDiabetes: features.familyDiabetes === true || features.familyDiabetes === 'yes',
    highBP: features.highBP === true || features.highBP === 'yes',
    physicallyActive: features.physicallyActive || 'none',
    bmi: parseFloat(features.bmi || 25),
    smoking: features.smoking === true || features.smoking === 'yes',
    alcohol: features.alcohol === true || features.alcohol === 'yes',
    sleepHours: parseFloat(features.sleepHours || 7),
    soundSleep: parseFloat(features.soundSleep || 6),
    regularMedicine: features.regularMedicine === true || features.regularMedicine === 'yes',
    junkFood: features.junkFood || 'occasionally',
    stress: features.stress || 'sometimes',
    bpLevel: features.bpLevel || 'normal',
    pregnancies: parseFloat(features.pregnancies || 0),
    prediabetes: features.prediabetes === true || features.prediabetes === 'yes',
    urinationFreq: features.urinationFreq || 'not much'
  };

  try {
    // 1. PRIMARY: ML Inference
    const mlResult = await runInference('diabetes', sanitized);
    result = {
      probability: mlResult.probability,
      prediction: mlResult.prediction
    };
  } catch (err) {
    // 2. EMERGENCY: Silent fallback
    console.warn('[DIABETES_SERVICE] ML Offline - Deploying Safety Net:', err.message);
    const fallback = _heuristicFallback(sanitized);
    result = {
      probability: fallback.probability,
      prediction: fallback.prediction
    };
    engineType = 'heuristic-safe-net';
  }

  const prob = result.probability;
  const label = _toRiskLabel(prob);
  const score = Math.round(prob * 100);

  return {
    prediction:      label,
    confidence:      parseFloat(prob.toFixed(4)),
    riskBand:        _toRiskBand(prob),
    riskScore:       score,
    interpretation:  _interpretation(label),
    recommendations: _recommendations(features, label),
    ml_prediction:   result.prediction,
    features:        sanitized,
    engine:          engineType
  };
};

module.exports = { predict };
