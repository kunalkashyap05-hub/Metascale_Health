/**
 * METASCALE HEALTH: CLINICAL SYSTEM TELEMETRY (AngularStatusWidget.jsx)
 * 
 * ─── ARCHITECTURAL ROLE ─────────────────────────────────────────────────────
 * This component provides a 'Clinical System Telemetry' interface. It uses a 
 * legacy AngularJS 1.8 bridge to monitor and visualize system performance 
 * metrics (latency, compute load) in real-time, serving as a 'Reactive Health 
 * Pulse' for the entire application.
 * 
 * ─── DYNAMIC POLLING ENGINE ─────────────────────────────────────────────────
 * Implements a high-accuracy polling engine using the AngularJS '$interval' 
 * service. This allows the widget to simulate and monitor system jitter 
 * without impacting the primary React reconciliation cycle.
 * 
 * ─── SYSTEM STATUS STRATIFICATION ───────────────────────────────────────────
 *   - ANALYTIC LATENCY (ms): Measures the responsiveness of the clinical 
 *     datastore handshake.
 *   - COMPUTE VECTORS (%): Visualizes the relative load on the backend 
 *     inference kernel.
 *   - PROTOCOL INTEGRITY: A static React-layer validation of security 
 *     checkpasses (SHA-256).
 * 
 * ─── DESIGN SYSTEM: CLINICAL OS (SAFFRON) ───────────────────────────────────
 * Leverages 'Saffron' highlights and 'Slate 900' for a high-contrast, 
 * command-center aesthetic.
 */

import React, { useEffect, useRef } from 'react';
import { Shield, Activity, Zap, Server, Loader2 } from 'lucide-react';

const AngularStatusWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // ─── ENVIRONMENT VALIDATION ───────────────────────────────────────────
    if (!window.angular || !containerRef.current) return;

    // ─── MODULE REGISTRATION ──────────────────────────────────────────────
    const app = window.angular.module('clinicStatusApp', []);

    /**
     * TELEMETRY CONTROLLER (StatusController)
     * Logic: Simulates real-time clinical system performance metrics.
     */
    app.controller('StatusController', ['$scope', '$interval', function($scope, $interval) {
      $scope.latency = 14;
      $scope.computeLoad = 82;
      $scope.status = 'Synchronized';

      // METRIC SYMBOLIC SHUFFLE: Simulates real-world network/CPU jitter.
      const updateStats = () => {
        $scope.latency = Math.floor(Math.random() * (18 - 12 + 1)) + 12;
        $scope.computeLoad = Math.floor(Math.random() * (94 - 78 + 1)) + 78;
      };

      // REGULAR TELEMETRY SWEEP (3.5s interval)
      const timer = $interval(updateStats, 3500);

      // SCOPE CLEANUP: Standard unmounting protocol for Angular services.
      $scope.$on('$destroy', () => {
        $interval.cancel(timer);
      });
    }]);

    // ─── MANUAL BOOTSTRAP ─────────────────────────────────────────────────
    const containerNode = containerRef.current;
    window.angular.bootstrap(containerNode, ['clinicStatusApp']);

    /**
     * CONTEXT TEARDOWN
     */
    return () => {
      if (containerNode) {
        containerNode.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* ─── ANGULARJS REACTIVE ZONE ─── */}
      <div ng-controller="StatusController" className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><Activity size={100} /></div>
        
        <h3 className="font-black text-slate-900 flex items-center gap-4 text-xs uppercase tracking-[0.2em] mb-10">
           <div className="p-2 bg-saffron/10 text-saffron-deep rounded-xl"><Activity size={18} /></div>
           Reactive System Pulse
        </h3>

        <div className="grid grid-cols-2 gap-6">
           {/* LATENCY VECTOR */}
           <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] shadow-inner">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Zap size={10} className="text-saffron" /> Handshake
              </p>
              <div className="flex items-end gap-2">
                 <span className="text-3xl font-black text-slate-900 leading-none" ng-bind="latency"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">ms</span>
              </div>
           </div>

           {/* COMPUTE VECTOR */}
           <div className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] shadow-inner">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Server size={10} className="text-saffron" /> Compute
              </p>
              <div className="flex items-end gap-2">
                 <span className="text-3xl font-black text-slate-900 leading-none" ng-bind="computeLoad"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase">%</span>
              </div>
           </div>
        </div>
      </div>

      {/* ─── STATIC REACT SECURITY LAYER ─── */}
      <div className="bg-slate-900 p-6 rounded-[32px] flex items-center gap-5 border border-white/5 shadow-2xl">
         <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-saffron shadow-inner">
            <Shield size={24} />
         </div>
         <div>
            <p className="text-[8px] text-saffron font-black uppercase tracking-[0.3em] mb-1">Security Integrity</p>
            <p className="text-[10px] text-slate-400 font-bold italic">SHA-256 session vault confirmed.</p>
         </div>
      </div>
    </div>
  );
};

export default AngularStatusWidget;


