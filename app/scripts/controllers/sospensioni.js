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
      var editForm = {
            cod_tipo_sospensione: ''
          , id_motivo_sospensione: null
          , id_sospensione_dettaglio: null
          , data_sospensione: null
          , annotazioni: null
          , setMotivoSospensione: function(v) { this.id_motivo_sospensione = v; }
          , setMotivoSospensione2: function(v) { this.id_sospensione_dettaglio = v; }
          };

      var sospensioni_mngr = function(data) {
        var grouped = _.groupBy(data,'sospensione');

        return {
          edit: editForm,

          getMotiviSospensione: function() { 
            return _(grouped).keys().map(function(k) {
              return {id: k, desc: grouped[k][0]['sospensione']};
            }).value(); 
          },
          getMotiviSospensione2: function() { 
            if(!this.edit.id_motivo_sospensione) return [];
            var ret = _(grouped[this.edit.id_motivo_sospensione])
              .filter(function(i){ return i.id_sospensione_dettaglio !== null; })
              .map(function(i) { return {id: i.id_sospensione_dettaglio, desc: i.id_sospensione_dettaglio}; })
              .value();
            return ret;
          }
        };
      };


      var init = function() {
        loadDataListIntoScope(
          $scope,
          [ 'cod_tipo_sospensione'],
          function(p) { return '/data/_' + p;}
        ); 

        dataUrl = {
          sospensioni: '/data/pazienti/' + $routeParams.idPaziente + '/sospensioni'
        };

        $scope.formState = {};
        $scope.edit_sospensione = {};
        
        // init di $scope.sospensioni
        $http.get(dataUrl.sospensioni)
          .success(function(data, status, headers, config) {
            $scope.sospensioni = data || [];
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura delle sospensioni del paziente.\nControlla la connessione al server!");
            $scope.sospensioni = [];
          });

        $http.get('/data/_tipo_sospensione')
          .success(function(data, status, headers, config) {
            $scope.tipo_sospensione = sospensioni_mngr(data);
            console.log("tipo sospensione:");
            console.log($scope.tipo_sospensione.getMotiviSospensione());
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura delle sospensioni del paziente.\nControlla la connessione al server!");
            $scope.tipo_sospensione = {};
          });

      };

      init();

    }
  ]);
})();

