import React, { useEffect, useRef } from 'react';
import { Shield, Clock, Users } from 'lucide-react';

const AngularStatusWidget = () => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!window.angular || !nodeRef.current) return;

    const app = window.angular.module('clinicStatusApp', []);

    app.controller('StatusController', ['$scope', '$interval', function($scope, $interval) {
      $scope.uptime = 0;
      $scope.tipIndex = 0;
      
      $scope.healthTips = [
        "WHO: Drink at least 8 glasses of water daily to maintain metabolic efficiency.",
        "WHO: Aim for at least 150 minutes of moderate-intensity physical activity weekly.",
        "WHO: Reduce salt intake to less than 5g per day to help prevent hypertension.",
        "WHO: Regular screening for liver health is essential for early fatty liver detection.",
        "WHO: Maintain a healthy BMI (18.5–24.9) to significantly lower diabetes risk.",
        "WHO: Eat at least 400g, or five portions, of fruit and vegetables per day.",
        "WHO: Limit intake of free sugars to less than 10% of total energy intake.",
        "WHO: Avoid tobacco and limit alcohol to protect your liver and pancreas."
      ];

      $scope.currentTip = $scope.healthTips[0];
      
      // Update session timer every second (Real Logic)
      $interval(function() {
        $scope.uptime += 1;
      }, 1000);

      // Rotate WHO Tips every 10 seconds (Requested Logic)
      $interval(function() {
        $scope.tipIndex = ($scope.tipIndex + 1) % $scope.healthTips.length;
        $scope.currentTip = $scope.healthTips[$scope.tipIndex];
      }, 10000);

    }]);

    const node = nodeRef.current;
    window.angular.bootstrap(node, ['clinicStatusApp']);

    return () => {
      if (node) node.innerHTML = '';
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 mb-24" ref={nodeRef}>
      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/60 shadow-2xl flex flex-wrap items-center justify-between gap-8 relative overflow-hidden" ng-controller="StatusController">
        
        <div className="flex items-center gap-6 flex-1 min-w-[300px]">
          <div className="w-14 h-14 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron shrink-0 shadow-inner">
            <Shield size={28} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-saffron-deep uppercase tracking-[0.2em] mb-1">WHO Clinical Advisory</p>
            <p className="text-lg font-bold text-slate-900 leading-tight transition-all duration-500 animate-pulse" ng-bind="currentTip"></p>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 border-l border-black/5 pl-8">
            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Session</p>
              <p className="text-sm font-black text-slate-900 uppercase tracking-tight"><span ng-bind="uptime"></span>s Active</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AngularStatusWidget;
