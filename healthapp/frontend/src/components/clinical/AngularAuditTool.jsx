/**
 * METASCALE HEALTH: CLINICAL MICRO-BRIDGE (AngularAuditTool.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component acts as a high-fidelity 'Micro-Frontend Bridge'. It enables 
 * the seamless persistence of legacy AngularJS 1.8 metabolic logic within 
 * the modern React 19 ecosystem. This ensures that battle-tested clinical 
 * formulas are preserved without requiring a full-stack rewrite.
 * 
 * ─── REACT-ANGULAR INTEROPERABILITY ─────────────────────────────────────────
 *   1. ISOLATED DOM BOOTSTRAP: React manages the lifecycle of the container, 
 *      while AngularJS handles the inner-view logic through manual 
 *      'bootstrapping' on a dedicated ref.
 *   2. REACTIVE SCOPE KERNEL: Leverages the legacy '$scope' pattern for 
 *      real-time biometric computations, creating an instant feedback loop 
 *      for metabolic data entry.
 *   3. LINTING & CLEANUP: Implements strict unmounting protocols to prevent 
 *      framework leakage and memory bloat.
 * 
 * ─── BIOMETRIC FORMULA KERNEL ───────────────────────────────────────────────
 *   - BMI ENGINE: Weight (kg) / Height (m)^2 — Clinical Triage base.
 *   - BMR KERNEL: Mifflin-St Jeor Equation — Standard for metabolic pulse analysis.
 */

import React, { useEffect, useRef } from 'react';
import { Activity, Thermometer } from 'lucide-react';

const AngularAuditTool = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // ─── ENVIRONMENT VALIDATION ───────────────────────────────────────────
    // Verification of the global 'angular' vector; crucial for bridge stability.
    if (!window.angular || !containerRef.current) return;

    // ─── MODULE REGISTRATION ──────────────────────────────────────────────
    // Creating an isolated clinical namespace for legacy logic.
    const app = window.angular.module('metabolicAuditApp', []);

    /**
     * SCOPE ARCHITECTURE (MetabolicController)
     * Logic: Defines the reactive nodes for the biometric audit.
     */
    app.controller('MetabolicController', ['$scope', function($scope) {
      // DEFAULT BIOMETRIC BUFFERS
      $scope.weight = 70;
      $scope.height = 175;
      $scope.age = 30;
      $scope.gender = 'male';
      
      /**
       * BMI SYNTHESIS
       * Logic: Standardized Body Mass Index calculation.
       */
      $scope.calculateBMI = function() {
        if (!$scope.height || !$scope.weight) return 0;
        const heightInMeters = $scope.height / 100;
        return ($scope.weight / (heightInMeters * heightInMeters)).toFixed(1);
      };

      /**
       * BMR METABOLIC PULSE
       * Logic: Computes Basal Metabolic Rate using the Mifflin-St Jeor standard.
       */
      $scope.calculateBMR = function() {
        let bmr = (10 * $scope.weight) + (6.25 * $scope.height) - (5 * $scope.age);
        if ($scope.gender === 'male') {
          bmr += 5;
        } else {
          bmr -= 161;
        }
        return Math.round(bmr);
      };

      /**
       * CLINICAL RISK STRATIFICATION
       * Logic: Maps numeric metrics into descriptive clinical bands.
       */
      $scope.getBMICategory = function(bmi) {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-slate-400' };
        if (bmi < 25) return { label: 'Optimal', color: 'text-emerald-500' };
        if (bmi < 30) return { label: 'Elevated', color: 'text-saffron-deep' };
        return { label: 'Critical', color: 'text-rose-500' };
      };
    }]);

    // ─── MANUAL BOOTSTRAP INVOCATION ──────────────────────────────────────
    // Forcing the AngularJS lifecycle to originate from the React-managed node.
    const containerNode = containerRef.current;
    window.angular.bootstrap(containerNode, ['metabolicAuditApp']);

    /**
     * CONTEXT TEARDOWN
     * Logic: Zeroes out innerHTML to ensure complete framework abstraction.
     */
    return () => {
      if (containerNode) {
        containerNode.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-[40px] overflow-hidden border border-slate-50 shadow-2xl relative" ref={containerRef}>
      {/* TOOL HEADER: Framework Synchronization Branding */}
      <div className="p-8 bg-slate-900 border-b border-white/5 flex items-center justify-between">
        <h3 className="font-black text-white flex items-center gap-4 text-sm uppercase tracking-widest">
           <div className="p-2 bg-saffron/10 text-saffron rounded-xl"><Activity size={20} /></div>
           Legacy Diabetes Screening
        </h3>
        <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">Clinical Bridge v1.8</span>
      </div>
      
      {/* 
        ─── ANGULARJS REACTIVE ZONE ──────────────────────────────────────────
        The following DOM subtree is managed solely by the legacy framework.
      */}
      <div ng-controller="MetabolicController" className="p-10 space-y-10">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Weight Buffer (kg)</label>
            <input 
              type="number" ng-model="weight" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold outline-none focus:ring-4 focus:ring-saffron/5 shadow-inner"
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Height Buffer (cm)</label>
            <input 
              type="number" ng-model="height" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-bold outline-none focus:ring-4 focus:ring-saffron/5 shadow-inner"
            />
          </div>
        </div>

        {/* METABOLIC SUMMARY TILES */}
        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-8 rounded-[32px] border border-slate-100 shadow-inner">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">BMI Registry</p>
            <p className="text-3xl font-black text-slate-900 leading-none" ng-bind="calculateBMI()"></p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">BMR Impulse</p>
            <p className="text-3xl font-black text-slate-900 leading-none" ng-bind="calculateBMR()"></p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Status</p>
            <p className="text-xs font-black uppercase tracking-widest" ng-class="getBMICategory(calculateBMI()).color" ng-bind="getBMICategory(calculateBMI()).label">
            </p>
          </div>
        </div>

        {/* CLINICAL TELEMETRY FOOTER */}
        <div className="p-6 bg-saffron/5 rounded-3xl border border-saffron/10 flex items-start gap-4">
          <Thermometer size={20} className="text-saffron-deep shrink-0 mt-1" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose italic">
            This module provides a real-time metabolic handshake. Any biometric drift is calculated instantly via the Mifflin-St Jeor kernel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AngularAuditTool;


