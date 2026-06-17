/**
 * METASCALE HEALTH: PERSISTENCE ORCHESTRATOR (db.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This module manages the lifecycle of the connection between the Express node 
 * and the MySQL database (the 'Clinical Repository').
 * 
 * ─── CONNECTION POOLING STRATEGY ─────────────────────────────────────────────
 * Instead of opening/closing a socket for every single query (which is slow 
 * and resource-heavy), we use a 'Pool' pattern.
 *   - The 'Pool' maintains a warm cache of open connections (Limit: 10).
 *   - When a request comes in, it 'borrows' a connection, executes the SQL, 
 *     and instantly 'returns' it. 
 *   - This allows the system to handle burst clinical traffic without 
 *     crashing the database process.
 * 
 * ─── ASYNCHRONOUS I/O (mysql2/promise) ──────────────────────────────────────
 * We use the 'mysql2/promise' wrapper to ensure all DB operations are non-blocking.
 * This allows the Node.js event loop to continue processing other patient 
 * requests while waiting for the database to return records.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * POOL CONFIGURATION
 * Logic: We prioritize temporal integrity and high-availability.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'metascale_health',
  
  // PERFORMANCE TUNING
  waitForConnections: true,  // If all 10 lines are busy, wait rather than erroring.
  connectionLimit: 10,       // Max simultaneous pipelines to the DB.
  queueLimit: 0,              // No limit on the 'wait line' for burst traffic.

  /**
   * TEMPORAL INTEGRITY (dateStrings: true)
   * Critical Logic: By default, MySQL drivers convert 'DATE' fields into 
   * JS Date objects. This often causes "off-by-one-day" errors due to 
   * server/client timezone offsets.
   * By setting 'dateStrings' to true, we treat dates as raw strings (YYYY-MM-DD), 
   * ensuring that a 10:00 AM appointment in Mumbai doesn't appear as a 
   * 4:30 AM appointment in London.
   */
  dateStrings: true, 
});

/**
 * CONNECTIVITY VALIDATOR (testConnection)
 * Logic: Attempts a 'Dummy Handshake' to verify the infrastructure is alive.
 * Fail-Fast: If this fails, the server entry point (server.js) will abort 
 * the startup sequence.
 */
const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL Connectivity: Oracle Node Established.');
    conn.release(); // IMMEDIATELY return the line to the pool cache.
  } catch (err) {
    console.error('❌ Infrastructure Fault: Database repository unreachable.');
    console.error(`Root Cause: ${err.message}`);
    // We exit here because the system cannot function without its clinical data layer.
    process.exit(1);
  }
};

module.exports = { pool, testConnection };


