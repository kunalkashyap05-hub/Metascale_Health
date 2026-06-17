import React, { useEffect, useRef } from 'react';

const AngularPasswordStrength = ({ password }) => {
  const nodeRef = useRef(null);
  const angularInited = useRef(false);

  useEffect(() => {
    if (!window.angular || !nodeRef.current) return;

    if (!angularInited.current) {
        const app = window.angular.module('pwdStrengthApp', []);

        app.controller('StrengthController', ['$scope', function($scope) {
          $scope.strength = '';
          $scope.strengthLabel = 'Enter Password';
          $scope.strengthColor = '#94a3b8'; // Slate-400

          $scope.checkStrength = function(val) {
             if (!val) {
                $scope.strengthLabel = 'Enter Password';
                $scope.strengthColor = '#94a3b8';
                return;
             }
             
             if (val.length < 6) {
                $scope.strengthLabel = 'Weak Security';
                $scope.strengthColor = '#ef4444'; // Red-500
             } else if (val.length >= 6 && /[0-9]/.test(val) && /[a-z]/.test(val)) {
                if (val.length > 8 && /[^A-Za-z0-9]/.test(val)) {
                    $scope.strengthLabel = 'Strong Security';
                    $scope.strengthColor = '#22c55e'; // Green-500
                } else {
                    $scope.strengthLabel = 'Moderate Security';
                    $scope.strengthColor = '#f7931e'; // Saffron
                }
             } else {
                $scope.strengthLabel = 'Weak Security';
                $scope.strengthColor = '#ef4444';
             }
          };

          // Expose to window for external React updates if necessary
          window.updateAngularPwd = (newVal) => {
             $scope.$apply(() => {
                $scope.checkStrength(newVal);
             });
          };
        }]);

        window.angular.bootstrap(nodeRef.current, ['pwdStrengthApp']);
        angularInited.current = true;
    }

    // Sync React prop to AngularJS
    if (window.updateAngularPwd) {
        window.updateAngularPwd(password);
    }

    return () => {
      // Cleanup happens on unmount if needed
    };
  }, [password]);

  return (
    <div ref={nodeRef} className="mt-2 ml-1">
      <div ng-controller="StrengthController" className="flex items-center gap-2">
        <div className="flex gap-1">
            <div className="w-10 h-1 rounded-full transition-all duration-500" 
                 style={{ backgroundColor: (password && password.length > 0) ? '{ { strengthColor } }'.replace(/\{ \{ | \} \}/g, '') : '#e2e8f0' }}></div>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] transition-colors duration-500" 
           style={{ color: '{ { strengthColor } }'.replace(/\{ \{ | \} \}/g, '') }}>
           <span ng-bind="strengthLabel"></span>
        </p>
      </div>
    </div>
  );
};

export default AngularPasswordStrength;
