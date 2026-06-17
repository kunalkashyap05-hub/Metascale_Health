/**
 * METASCALE HEALTH: SERVER ENTRY POINT (The Physical Execution Layer)
 * 
 * ─── ARCHITECTURAL CONTEXT ──────────────────────────────────────────────────
 * This file serves as the 'Bootstrap' or 'Entry Point' for the Node.js process. 
 * We separate 'server.js' from 'app.js' to achieve a high degree of decoupling:
 *   - 'app.js' contains the logical Express configuration (middleware, routes).
 *   - 'server.js' handles the physical environment (ports, DB connections, listener).
 * 
 * This separation is critical for:
 *   1. Automated Testing: We can import 'app.js' into Supertest without booting 
 *      the physical network listener, preventing 'Address in use' errors.
 *   2. Portability: We can change the listener protocol (HTTP vs HTTPS) without 
 *      refactoring the core business logic.
 * 
 * ─── BOOTSTRAP LOGIC ────────────────────────────────────────────────────────
 * Current Philosophy: 'Fail-Fast'. If the database (the clinical repository) 
 * is down, the server should not start. This prevents 'half-alive' states where 
 * patients can hit the website but receive cryptic 500 errors on every action.
 */

const app = require('./app');
const { testConnection } = require('./config/db');

/**
 * NETWORK CONFIGURATION
 * Logic: Port 5000 is our standardized 'Clinical Node' port. 
 * In production (e.g., Vercel, Railway), the 'PORT' environment variable is 
 * dynamically injected by the infrastructure.
 */
const PORT = process.env.PORT || 5000;

/**
 * BOOTSTRAP ENGINE (startServer)
 * Purpose: Orchestrates the asynchronous initialization sequence.
 * 
 * Steps:
 *   1. Connection Pre-flight: Verifies the MySQL pool is active.
 *   2. Network Binding: Activates the HTTP listener on all interfaces.
 */
const startServer = async () => {
  try {
    // 1. DATABASE INTEGRITY CHECK
    // Before accepting a single packet of traffic, we verify that our 
    // SQL Oracle (MySQL) is healthy. This ensures data consistency from T-0.
    await testConnection();

    // 1b. CLINICAL SCHEMA SYNCHRONIZATION
    // Automatically patch missing columns (common when deploying to Railway 
    // from an older schema version).
    const syncSchema = require('./utils/migrate');
    await syncSchema();

    // 2. NETWORK INTERFACE ACTIVATION (Binding to 0.0.0.0)
    // We listen on '0.0.0.0' instead of just 'localhost' to allow the 
    // server to be reachable across a local area network (LAN).
    // This is essential for cross-device clinical testing (e.g., a doctor 
    // accessing the dev-server from a tablet in the same room).
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Metascale Health: Clinical Node active at port ${PORT}`);
      console.log(`🌐 Network Visibility: Wide (bind: 0.0.0.0)`);
    });

  } catch (err) {
    /**
     * FATAL FAULT HANDLER
     * If the DB is unreachable, we log a 'Safe Shutdown' and exit the process.
     * This prevents the server from existing in a non-functional state.
     */
    console.error('❌ Critical Infrastructure Failure: Server bootstrap aborted.');
    console.error(`Root Cause: ${err.message}`);
    process.exit(1);
  }
};

// Execution Trigger: Start the engine.
startServer();


