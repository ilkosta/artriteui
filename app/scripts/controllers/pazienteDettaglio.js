(function (){
  var mod = angular.module('app.controllers');

  mod.controller('PazienteDettaglioCtrl', [
    '$scope', '$routeParams', '$location', 'Restangular', 'activeForCurrentRoute',
    function($scope, $routeParams,$location, Restangular, activeForCurrentRoute) {
      
      Restangular
        .one('pazienti', $routeParams.idPaziente)
        .get()
        .then(function(pazienti){
          // manage the error (nessun))
          $scope.paziente = pazienti[0];
        });  
        

      $scope.$watch('$location.path()', function(path) {
        return $scope.activeNavId = path || '/';
      });

      $scope.getClass = activeForCurrentRoute($scope);
    }
  ]);

}());