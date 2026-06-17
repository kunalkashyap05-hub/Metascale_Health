/**
 * METASCALE HEALTH: SECURITY ENTROPY ANALYZER (AngularPasswordStrength.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Security Triage Engine' for user onboarding. 
 * Its primary role is to perform real-time entropy analysis on incoming 
 * credentials, ensuring that every identity in the system is guarded by 
 * high-resilience passwords.
 * 
 * ─── ENTROPY ANALYSIS KERNEL ────────────────────────────────────────────────
 * The engine evaluates password strength across three critical dimensions:
 *   1. TEMPORAL COMPLEXITY: Length-based heuristics (brute-force defense).
 *   2. VARIATION DENSITY: Detection of mixed-case and numeric vectors.
 *   3. SYMBOLIC ENTROPY: Identification of special characters to increase 
 *      search space.
 * 
 * ─── VISUAL SECURITY TIERING ────────────────────────────────────────────────
 * Maps raw entropy scores into human-readable clinical tiers:
 *   - VULNERABLE (0-40%): High risk of compromise.
 *   - RESILIENT (40-80%): Standard professional security.
 *   - IMMUTABLE (80-100%): Maximum-tier cryptographic resilience.
 * 
 * ─── DESIGN SYSTEM: CLINICAL OS (SAFFRON) ───────────────────────────────────
 * Utilizes dynamic 'Saffron' progress vectors and 'Shield' iconography to 
 * provide instant visual feedback on credential strength.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

const AngularPasswordStrength = ({ password }) => {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('Missing');

  useEffect(() => {
    // ─── ENTROPY COMPUTATION LOGIC ───────────────────────────────────────
    if (!password) {
      setStrength(0);
      setLabel('Missing');
      return;
    }

    let score = 0;
    
    // 1. LENGTH HEURISTICS (Baseline: 40% of total score)
    if (password.length > 5) score += 20;
    if (password.length > 8) score += 20;

    // 2. VARIATION VECTORS (RegEx: 60% of total score)
    if (/[A-Z]/.test(password)) score += 20;       // Uppercase detection
    if (/[0-9]/.test(password)) score += 20;       // Numeric detection
    if (/[^A-Za-z0-9]/.test(password)) score += 20; // Special character detection

    setStrength(score);

    // 3. SECURE TIER MAPPING
    if (score < 40) setLabel('Vulnerable');
    else if (score < 80) setLabel('Resilient');
    else setLabel('Immutable');
  }, [password]);

  // COLOR SCHEME SYNCHRONIZATION
  const getProgressColor = () => {
    if (strength < 40) return 'bg-rose-500';
    if (strength < 80) return 'bg-saffron';
    return 'bg-emerald-500';
  };

  const getLabelColor = () => {
    if (strength < 40) return 'text-rose-500';
    if (strength < 80) return 'text-saffron-deep';
    return 'text-emerald-500';
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in duration-300">
      {/* ─── STATUS HEADER ─── */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
           {strength < 40 ? <ShieldAlert size={14} className="text-rose-500" /> : 
            strength < 80 ? <Shield size={14} className="text-saffron" /> : 
            <ShieldCheck size={14} className="text-emerald-500" />}
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Entropy</span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${getLabelColor()}`}>{label}</span>
      </div>

      {/* ─── VISUAL PROGRESS VECTOR ─── */}
      {/* Visualizes calculated entropy as a professional linear progress bar */}
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          className={`h-full transition-all duration-700 ease-in-out ${getProgressColor()}`}
        />
      </div>

      {/* ─── CLINICAL ADVISORY ─── */}
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight italic leading-relaxed">
        Advisory: Aim for high-entropy combinations (Mixed case + symbols).
      </p>
    </div>
  );
};

export default AngularPasswordStrength;


