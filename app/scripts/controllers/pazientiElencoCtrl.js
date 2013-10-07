(function (){

  var mod = angular.module('app.controllers');

  mod.controller('PazientiElencoCtrl', [
    '$scope', 'Restangular', function($scope, Restangular) {

      Restangular.all('pazienti').getList().then( function(pazienti) {
        var dates = ['DATA_DIAGNOSI', 'DATA_TERAPIA','DATA_NASCITA'];
        
        $scope.pazienti = pazienti;
      });

    }
  ]);

}());