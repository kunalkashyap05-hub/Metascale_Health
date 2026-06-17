/**
 * METASCALE HEALTH: SCHEMA SYNCHRONIZATION ENGINE (migrate.js)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This utility ensures that the production database (e.g. on Railway) stays 
 * in sync with the clinical requirements defined in the latest codebase. 
 * 
 * ─── WHY THIS IS NECESSARY ──────────────────────────────────────────────────
 * Standard 'CREATE TABLE IF NOT EXISTS' scripts do not add new columns to 
 * existing tables. This engine performs a 'Cold-Start Audit' on every 
 * server boot to identify and patch missing fields.
 */

const { pool } = require('../config/db');

const syncSchema = async () => {
  console.log('🔍 [DATABASE AUDIT] Initiating clinical schema synchronization...');
  
  try {
    // 1. Describe current state
    const [columns] = await pool.query('DESCRIBE users');
    const existingColumns = columns.map(c => c.Field);

    // 2. Define required clinical signatures
    const requirements = [
      { name: 'medical_council', type: 'VARCHAR(120) DEFAULT \'\'' },
      { name: 'years_of_experience', type: 'INT DEFAULT 0' },
      { name: 'qualification', type: 'VARCHAR(120) DEFAULT \'\'' },
      { name: 'license_number', type: 'VARCHAR(80) DEFAULT \'\'' },
      { name: 'is_approved', type: 'TINYINT(1) DEFAULT 1' }
    ];

    // 3. Execution Loop: Atomic Patching
    for (const req of requirements) {
      if (!existingColumns.includes(req.name)) {
        console.warn(`⚠️ [DATABASE AUDIT] Missing signature: ${req.name}. Applying patch...`);
        await pool.query(`ALTER TABLE users ADD COLUMN ${req.name} ${req.type}`);
        console.log(`✅ [DATABASE AUDIT] Field ${req.name} successfully provisioned.`);
      }
    }

    console.log('🏁 [DATABASE AUDIT] Clinical schema is fully synchronized.');
  } catch (err) {
    console.error('❌ [DATABASE AUDIT] Synchronization failed:', err.message);
    // We don't exit the process here to allow the server to boot if only 
    // non-critical fields are failing, but the controllers will fail later 
    // if required fields are still missing.
  }
};

module.exports = syncSchema;
