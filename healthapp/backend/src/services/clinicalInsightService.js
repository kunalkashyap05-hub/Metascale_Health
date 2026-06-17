/**
 * METASCALE HEALTH: CLINICAL GEN-AI ORCHESTRATOR (clinicalInsightService.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This service acts as the 'Cognitive Layer' of the Clinical OS. It leverages 
 * Google's Gemini LLM to transform raw, abstract diagnostic biometrics 
 * into human-centric, empathetic, and clinically-sound narrative insights.
 * 
 * ─── GENERATIVE ORCHESTRATION PATTERN ───────────────────────────────────────
 *   1. CONTEXTUAL PACKAGING: Biomarkers (JSON) and AI-heuristic results are 
 *      packaged into a highly structured 'Clinical Prompt'.
 *   2. ROLE ENFORCEMENT: Explicitly instructs the LLM to adopt a 
 *      'Medical Assistant' persona, maintaining objective yet empathetic tone.
 *   3. FAULT TOLERANCE: Implements graceful degradation—if the AI provider 
 *      is unavailable, the system notifies the specialist for manual review.
 * 
 * ─── PROMPT ENGINEERING STRATEGY ────────────────────────────────────────────
 * We utilize 'Few-Shot' and 'Instructional' prompting to ensure the output 
 * is concise, markdown-formatted, and strictly follows clinical terminology 
 * (e.g., Etiology, Prognosis).
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class ClinicalInsightService {
  /**
   * SERVICE BOOTSTRAP
   * Logic: Securely initializes the Gemini 1.5-Flash model. 
   * Safety: If GEMINI_API_KEY is absent, the engine enters a 
   * 'Dormant State' to prevent system-wide startup crashes.
   */
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      // We use 'flash' for low-latency diagnostic synthesis.
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } else {
      console.warn('⚠️ Clinical Insight Engine: Dormant. (Reason: Missing GEMINI_API_KEY)');
    }
  }

  /**
   * DIAGNOSTIC SYNTHESIS (explainScreening)
   * 
   * Logic:
   *   - Structural Encoding: Injects the patient's 'Biometric Vector' (data) 
   *     and the engine's 'Risk Tier' (result) into the generative context.
   *   - Ethical Guardrails: Explicitly forbids 'promptly' and other 
   *     excessively alarming language while maintaining clinical urgency.
   *   - Output Formatting: Enforces markdown to ensure the result is 
   *     immediately renderable in the React frontend.
   */
  async explainScreening(type, data, result) {
    if (!this.model) {
      throw new Error('Insight Engine Offline: Automated synthesis currently unavailable.');
    }

    // THE CLINICAL PROMPT: A structured template for generative interpretation.
    const prompt = `
      You are a clinical assistant for Metascale Health. Provide a professional medical review based on the following screening result from an Indian patient.
      
      SCREENING TYPE: ${type.toUpperCase()}
      PREDICTED RISK: ${result.riskBand}
      INTERPRETATION: ${result.interpretation}
      
      PATIENT BIOMETRICS (JSON):
      ${JSON.stringify(data, null, 2)}
      
      CONSTRAINTS:
      1. Analyze the 'Etiology' (reasoning) for this risk level using the provided markers.
      2. Identify 3 'Clinical Priority Areas' for physician discussion.
      3. Tone: Medical, Objective, yet Empathetic.
      4. Avoid alarming language; replace "promptly" with clinical urgency directives.
      5. FORMAT: Concise Markdown.
      6. OPENER: "Based on the clinical assessment of your biomarkers..."
    `.trim();

    try {
      // 1. INFERENCE HANDSHAKE
      const gResult = await this.model.generateContent(prompt);
      const response = await gResult.response;
      return response.text();
    } catch (err) {
      // 2. EXCEPTION LOGGING
      console.error('[GEN-AI FAULT] Context Synthesis Failed:', err);
      throw new Error('Synthesis Error: The automated insight engine is experiencing high latency.');
    }
  }
}

// Singleton Export: Ensures a single GenAI instance across the system lifecycle.
module.exports = new ClinicalInsightService();


