const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * METASCALE HEALTH: EMERGENCY ML DISCOVERY KERNEL
 * 
 * This version is designed for mission-critical reliability during evaluations.
 * It uses a prioritized search to find Python anywhere on the system.
 */

const findInTree = (startDir, target, isDir = false) => {
  let current = startDir;
  while (current !== path.parse(current).root) {
    const fullPath = path.join(current, target);
    if (fs.existsSync(fullPath)) {
      if (isDir && fs.lstatSync(fullPath).isDirectory()) return fullPath;
      if (!isDir && fs.lstatSync(fullPath).isFile()) return fullPath;
    }
    current = path.dirname(current);
  }
  return null;
};

// 1. DISCOVER THE SCRIPT PATH (The most stable reference point)
const SCRIPT_PATH = findInTree(__dirname, 'healthapp/backend/scripts/inference.py') 
                  || findInTree(__dirname, 'backend/scripts/inference.py')
                  || findInTree(__dirname, 'scripts/inference.py')
                  || '/app/healthapp/backend/scripts/inference.py'; // Last resort absolute

// 2. DISCOVER THE PYTHON BINARY (Smart prioritized discovery)
const getPythonBinary = () => {
  // Scenario A: Check for project Venv (Priority)
  const rootDir = findInTree(__dirname, 'venv', true);
  if (rootDir) {
    const venvPath = path.join(rootDir, 'bin/python');
    if (fs.existsSync(venvPath)) return venvPath;
  }

  // Scenario B: Global Python3 (Most Cloud/Linux environments)
  return 'python3'; 
};

const PYTHON_BIN = getPythonBinary();

/**
 * Executes a machine learning prediction.
 * @param {string} serviceType - 'liver' or 'diabetes'
 * @param {Object} data - Features for inference
 * @returns {Promise<Object>} - Model output
 */
const runInference = (serviceType, data) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(SCRIPT_PATH)) {
      console.error('[ML_ENGINE] CRITICAL: Script not found at', SCRIPT_PATH);
      return reject(new Error('Inference script missing from deployment.'));
    }

    const inputPayload = JSON.stringify(data);
    
    // Use the discovered binary to execute
    execFile(PYTHON_BIN, [SCRIPT_PATH, serviceType, inputPayload], (error, stdout, stderr) => {
      if (error) {
        // Log the failure details but return a rejection for the service to handle
        console.error(`[ML_ENGINE][${serviceType.toUpperCase()}] EXEC_ERROR:`, stderr || error.message);
        return reject(new Error(stderr || error.message || 'Python process fault.'));
      }

      try {
        const result = JSON.parse(stdout);
        if (result.status === 'error') return reject(new Error(result.message));
        resolve(result);
      } catch (parseError) {
        reject(new Error('Incomplete telemetry from ML kernel.'));
      }
    });
  });
};

module.exports = { runInference };
