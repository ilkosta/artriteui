(function (){

  var mod = angular.module('app.controllers');

  mod.controller('PazientiElencoCtrl', [
    '$scope', '$http', 'growl', function($scope, $http,growl) {
      $http.get('/data/pazienti')
        .success(function(data, status, headers, config) {
          $scope.pazienti = data || [];
        })
        .error(function(data, status, headers, config) {
          growl.addErrorMessage("Errore nel caricamento dell'elenco dei pazienti.\nControlla la connessione al server!");
        });
    }
  ]);

}());