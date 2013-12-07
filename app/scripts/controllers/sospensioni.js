(function (){
  var mod = angular.module('app.controllers');

  mod.controller('SospensioniCtrl', [
    '$scope', '$routeParams',
    '$http', 'calendar' , 'growl', 
    'loadDataListIntoScope',
    function(
        $scope,$routeParams,
        $http, calendar, growl,
        loadDataListIntoScope) {

      var dataUrl = {};

      var init = function() {
        loadDataListIntoScope(
          $scope,
          [ 'cod_tipo_sospensione' , 'tipo_sospensione' ],
          function(p) { return '/data/_' + p;}
        ); 

        dataUrl = {
          sospensioni: '/data/pazienti/' + $routeParams.idPaziente + '/sospensioni'
        };

        $scope.formState = {};
        
        // init di $scope.sospensioni
        $http.get(dataUrl.sospensioni)
          .success(function(data, status, headers, config) {
            $scope.sospensioni = data || [];
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura delle sospensioni del paziente.\nControlla la connessione al server!");
            $scope.sospensioni = [];
          });

        
      };

      init();

      // -------------------------
      $scope.setTipoSospensione = function(value) { $scope.nuova_sospensione.cod_tipo_sospensione = value; };

    }
  ]);
})();
