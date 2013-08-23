'use strict';

/* Controllers
*/
var AppCtrl = [ 
  '$scope', '$location', '$resource', '$rootScope', function($scope, $location, $resource, $rootScope) {
    $scope.$location = $location;
    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });
    return $scope.getClass = function(id) {
      if ($scope.activeNavId.substring(0, id.length) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
];

var PazientiElencoCtrl = [
  '$scope', '$http', function($scope, $http) {
    return $http.get('data/pazienti.json').success(function(data) {
      return $scope.pazienti = data;
    });
  }
];

var PazientiNuovoCtrl =  [
  '$scope', function($scope) {
    $scope.master = {};
    $scope.update = function(user) {
      return $scope.master = angular.copy(user);
    };
    $scope.reset = function() {
      return $scope.user = angular.copy($scope.master);
    };
    return $scope.reset();
  }
];
