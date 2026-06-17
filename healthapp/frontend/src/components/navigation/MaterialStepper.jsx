/**
 * METASCALE HEALTH: DIAGNOSTIC WORKFLOW ORCHESTRATOR (MaterialStepper.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as the 'Workflow Orchestrator' for multi-stage clinical 
 * protocols. It provides a structured, linear interface that guides patients 
 * through complex screening phases, ensuring data integrity by enforcing 
 * sequential progression.
 * 
 * ─── LINEAR NAVIGATIONAL RIGOR ───────────────────────────────────────────────
 * The stepper implements a strict navigational policy:
 *   1. VALIDATION GATING: Users cannot proceed to subsequent diagnostic phases 
 *      until the current vector is fully captured and validated.
 *   2. HISTORICAL ACCESSIBILITY: Previously completed phases remain accessible 
 *      for review, while future phases are locked to maintain procedural rigor.
 *   3. STATE ENCAPSULATION: Centralizes active phase tracking to synchronize 
 *      the 'Clinical UI' with the user's current diagnostic context.
 * 
 * ─── ANIMATED CONNECTOR LOGIC ───────────────────────────────────────────────
 * Leverages 'Framer Motion' to interpolate a 'Progress Segment' between steps. 
 * This provides a high-fidelity visual indicator of the overall completion 
 * percentage of the diagnostic audit.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// UTILITY: Precision merging of Tailwind layers for state-dependent styling.
const cn = (...inputs) => twMerge(clsx(inputs));

const MaterialStepper = ({ 
  steps, 
  activeStep, 
  completedSteps, 
  onStepClick 
}) => {
  return (
    <div className="w-full py-10">
      <div className="flex items-center justify-between relative max-w-4xl mx-auto px-6">
        
        {/* ─── PROGRESS SEGMENT DYNAMICS ─── */}
        {/* Interpolates the width of the active diagnostic path relative to the total sequence. */}
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-50 -translate-y-12 md:-translate-y-1/2 -z-10 rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            className="h-full bg-saffron shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-700 ease-in-out"
          />
        </div>

        {steps.map((label, index) => {
          // PHASIC IDENTIFICATION
          const isActive = index === activeStep;
          const isCompleted = index < activeStep || completedSteps?.includes(index);
          
          return (
            <div key={index} className="flex flex-col items-center gap-4 relative group">
              {/* INTERACTIVE STEP NODE */}
              <motion.button
                whileHover={isCompleted || isActive ? { scale: 1.15 } : {}}
                whileTap={isCompleted || isActive ? { scale: 0.95 } : {}}
                onClick={() => onStepClick?.(index)}
                disabled={!isCompleted && !isActive}
                className={cn(
                  "w-12 h-12 rounded-[18px] flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2",
                  isActive ? "bg-slate-900 text-saffron border-slate-900 shadow-2xl scale-110" :
                  isCompleted ? "bg-white text-saffron border-saffron shadow-lg" :
                  "bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50"
                )}
              >
                {/* Visual completion acknowledgment */}
                {isCompleted ? <Check size={20} strokeWidth={4} /> : index + 1}
              </motion.button>
              
              {/* CLINICAL LABELING (Responsive) */}
              <div className="hidden lg:block absolute top-16 w-32 text-center transition-all duration-500">
                 <span className={cn(
                   "text-[9px] font-black uppercase tracking-[0.2em] inline-block py-1 px-3 rounded-lg",
                   isActive ? "text-slate-900 bg-saffron/10" : "text-slate-400"
                 )}>
                   {label}
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialStepper;


