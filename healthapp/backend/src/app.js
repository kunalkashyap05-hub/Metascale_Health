/**
 * METASCALE HEALTH: LOGICAL APPLICATION ORCHESTRATOR (app.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This file defines the core 'Logical Pipeline' of the Clinical OS. 
 * It is responsible for:
 *   1. Security Hardening (Headers, CORS, Rate Limiting).
 *   2. Request Parsing & Telemetry (JSON, Morgan).
 *   3. Domain-Specific Routing Table (Namespacing).
 *   4. Global Error Mitigation.
 * 
 * ─── MIDDLEWARE SEQUENCING ──────────────────────────────────────────────────
 * Order is critical in Express. The pipeline follows a 'Security First' approach:
 * [HEADERS] -> [CORS] -> [PARSING] -> [THROTTLING] -> [ROUTING] -> [ERRORS]
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorMiddleware');

// ─── ROUTE MODULE INJECTION ─────────────────────────────────────────────────
// Each module handles a specific clinical or administrative domain.
const authRoutes = require('./routes/authRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const app = express();

/**
 * TRUST PROXY CONFIGURATION
 * Logic: When deployed to modern cloudy environments (Railway, Vercel, Heroku), 
 * the app sits behind a Load Balancer. Setting 'trust proxy' to 1 allows 
 * Express to read the 'X-Forwarded-For' header, correctly identifying the 
 * patient's real IP for rate-limiting purposes.
 */
app.set('trust proxy', 1);

// ─── STAGE 1: SECURITY HARDENING ───────────────────────────────────────────

/**
 * HELMET: DEFENSIVE HTTP HEADERS
 * Logic: Automatically applies 15+ security headers (Strict-Transport-Security, 
 * Content-Security-Policy, etc.) to harden the server against common exploits 
 * like XSS and Clickjacking.
 */
app.use(helmet());

/**
 * CORS STRATEGY (Cross-Origin Resource Sharing)
 * Logic: Implements a 'Smart Whitelist'. We only allow traffic from:
 *   - The production frontend URL (stored in process.env.CLIENT_URL).
 *   - Local development environments (localhost:5173).
 *   - Private IP ranges (192.168.x.x) if in development mode, allowing 
 *     clinicians to test the app on local mobile devices.
 */
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL?.replace(/\/$/, ""),
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // 1. SYSTEMIC BYPASS: Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const isDev = process.env.NODE_ENV !== 'production';
    
    // 2. WHITELIST VALIDATION
    if (allowedOrigins.indexOf(origin) !== -1 || 
       (isDev && (origin.startsWith('http://192.168.') || origin.startsWith('http://172.') || origin.startsWith('http://10.')))) {
       return callback(null, true);
    }

    // 3. REJECTION LOG: Provides audit visibility into unauthorized access attempts.
    console.log(`[SECURITY AUDIT] CORS Rejection: Origin ${origin} attempted access.`);
    return callback(new Error('CORS Policy Violation: Origin Unauthorized.'), false);
  },
  credentials: true // Required for JWT session cookies in cross-origin requests.
}));

// ─── STAGE 2: PARSING & TELEMETRY ──────────────────────────────────────────

/**
 * JSON PAYLOAD PARSING
 * Logic: Converts raw buffer streams from incoming POST requests into 
 * standard Javascript objects (req.body).
 */
app.use(express.json());

/**
 * MORGAN: SYSTEMIC OBSERVABILITY
 * Logic: Spits out a high-performance log line for every request.
 * 'dev' format provides: [MET] [PATH] [STATUS] [LATENCY]
 */
app.use(morgan('dev'));

// ─── STAGE 3: TRAFFIC CONTROL ──────────────────────────────────────────────

/**
 * GLOBAL RATE LIMITING
 * Protection Logic: Prevents brute-force attacks and DoS (Denial of Service).
 * Maximum: 100 requests per 15-minute window per IP identity.
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minute window
  max: 100,               // Request ceiling
  message: 'Traffic saturation detected. Systemic cooling initiated. Retry in 15m.'
});
app.use('/api', limiter);

// ─── STAGE 4: DOMAIN NAMESPACE MAPPING ─────────────────────────────────────

/**
 * PATH-BASED ROUTING
 * Logic: Diverts systemic traffic to specialized clinical controllers.
 */
app.use('/api/auth', authRoutes);         // Identity & Session Lifecycle
app.use('/api/predict', predictionRoutes);   // Metabolic Risk Inference (Liver/Diabetes)
app.use('/api/doctor', doctorRoutes);       // Clinical Workflow Orchestration
app.use('/api/admin', adminRoutes);         // Governance & Provider Management
app.use('/api/appointments', appointmentRoutes); // Temporal Resource Allocation

// HEALTH CHECK: Direct verification of node vitality.
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Operational', node: 'Metascale Core v1' });
});

// ─── STAGE 5: FAULT TOLERANCE ──────────────────────────────────────────────

/**
 * GLOBAL ERROR PIPELINE
 * Logic: All errors 'bubble up' to this final middleware.
 * It ensures the client receives a structured JSON error instead of a 
 * raw HTML stack trace, preventing implementation detail leakage.
 */
app.use(errorHandler);

module.exports = app;


