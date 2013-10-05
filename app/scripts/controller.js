
'use strict';

var AppCtrl = [ 
  '$scope', '$location', '$resource', '$rootScope', function($scope, $location, $resource, $rootScope) {
    $scope.$location = $location;

    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });

    $scope.getClass = function(id) {
      var nrParts = (id.split('/').length - 1);
      var urlParts = $scope.activeNavId.split('/');
      var urlToValidate = '/' + urlParts.slice(-nrParts,urlParts.length).join('/');
      return (urlToValidate === id) ? 'active' : '';
    };

  }
];


var PazientiElencoCtrl = [
  '$scope', 'Restangular', function($scope, Restangular) {
    Restangular.setBaseUrl('/data');
    Restangular.all('pazienti').getList().then( function(pazienti) {
      var dates = ['DATA_DIAGNOSI', 'DATA_TERAPIA','DATA_NASCITA'];
      
      $scope.pazienti = pazienti;
  });
}];


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

