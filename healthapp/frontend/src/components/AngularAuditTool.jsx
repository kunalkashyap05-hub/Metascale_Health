import React, { useEffect, useRef } from 'react';
import { Activity, Thermometer } from 'lucide-react';

/**
 * AngularAuditTool - A bridge component to safely run AngularJS 1.8 inside React 19.
 * This satisfies legacy framework requirements without global application disruption.
 */
const AngularAuditTool = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.angular || !containerRef.current) return;

    // Define the legacy AngularJS module specifically for this widget
    const app = window.angular.module('metabolicAuditApp', []);

    app.controller('MetabolicController', ['$scope', function($scope) {
      $scope.weight = 70;
      $scope.height = 175;
      $scope.age = 30;
      $scope.gender = 'male';
      
      $scope.calculateBMI = function() {
        if (!$scope.height || !$scope.weight) return 0;
        const heightInMeters = $scope.height / 100;
        return ($scope.weight / (heightInMeters * heightInMeters)).toFixed(1);
      };

      $scope.calculateBMR = function() {
        // Mifflin-St Jeor Equation
        let bmr = (10 * $scope.weight) + (6.25 * $scope.height) - (5 * $scope.age);
        if ($scope.gender === 'male') {
          bmr += 5;
        } else {
          bmr -= 161;
        }
        return Math.round(bmr);
      };

      $scope.getBMICategory = function(bmi) {
        if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
        if (bmi < 25) return { label: 'Normal', color: 'text-green-500' };
        if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500' };
        return { label: 'Obese', color: 'text-red-500' };
      };
    }]);

    // Manually bootstrap AngularJS on the specific container element
    const containerNode = containerRef.current;
    window.angular.bootstrap(containerNode, ['metabolicAuditApp']);

    // Cleanup: AngularJS 1.x doesn't have a formal destroy for manual bootstrap,
    // but clearing the HTML prevents memory leaks in typical SPAs.
    return () => {
      if (containerNode) {
        containerNode.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="card overflow-hidden border-l-4 border-l-primary-600 shadow-xl shadow-slate-100" ref={containerRef}>
      <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Activity size={18} className="text-primary-600" /> Legacy Diabetes Screening
        </h3>
        <span className="px-2 py-0.5 bg-slate-200 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">AngularJS 1.8</span>
      </div>
      
      {/* This section is controlled by AngularJS directives */}
      <div ng-controller="MetabolicController" className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Weight (kg)</label>
            <input 
              type="number" 
              ng-model="weight" 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400">Height (cm)</label>
            <input 
              type="number" 
              ng-model="height" 
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Current BMI</p>
            <p className="text-2xl font-bold text-slate-900" ng-bind="calculateBMI()"></p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">BMR (kcal)</p>
            <p className="text-2xl font-bold text-slate-900" ng-bind="calculateBMR()"></p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
            <p className="text-xs font-bold uppercase tracking-tight" ng-class="getBMICategory(calculateBMI()).color" ng-bind="getBMICategory(calculateBMI()).label">
            </p>
          </div>
        </div>

        <div className="p-3 bg-primary-50/50 rounded-xl border border-primary-100/50 flex items-start gap-3">
          <Thermometer size={16} className="text-primary-600 mt-0.5" />
          <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
            This module represents a real-time metabolic handshake protocol. Adjust values to see instant reactive audit results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AngularAuditTool;
