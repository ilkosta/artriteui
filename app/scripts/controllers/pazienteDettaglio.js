(function (){
  var mod = angular.module('app.controllers');

  mod.controller('PazienteDettaglioCtrl', [
    '$scope', '$routeParams', '$location', '$http', 'activeForCurrentRoute',
    function($scope, $routeParams,$location, $http, activeForCurrentRoute) {
      $http.get('/data/pazienti/' + $routeParams.idPaziente + '/')
          .success(function(data, status, headers, config) {
            $scope.paziente = data[0];
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura dell paziente.\nControlla la connessione al server!");
            $scope.paziente = null;
          });

      $scope.$watch('$location.path()', function(path) {
        return $scope.activeNavId = path || '/';
      });

      $scope.getClass = activeForCurrentRoute($scope);
    }
  ]);

}());