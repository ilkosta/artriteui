
'use strict';

angular.module('app.controllers', []);

var mod = angular.module('app.controllers');

mod.controller('AppCtrl', [ 
  '$scope', '$location', '$resource', '$rootScope', 'activeForCurrentRoute',
  function($scope, $location, $resource, $rootScope,activeForCurrentRoute) {
    $scope.$location = $location;

    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });

    $scope.getClass = activeForCurrentRoute($scope);

  }
]);
