
(function (){
  var mod = angular.module('app.controllers');

  mod.controller('PazienteDiagnosiEditCtrl', [
    '$scope', '$location', '$routeParams',
    '$http', 'calendar' , 'growl', 
    'loadDataListIntoScope', 'decodeCodesInObject',
    function(
        $scope,$location, $routeParams,
        $http, calendar, growl,
        loadDataListIntoScope, decodeCodesInObject) {

      $scope.formState = {};

      var data_url = '/data/pazienti/' + $routeParams.idPaziente + '/diagnosimalattia';

      var Init = function() {

        loadDataListIntoScope(
          $scope,
          [ 'tipo_risposta' , 'malattia_ric' ],
          function(p) { return '/data/_' + p;}
        );

        $http.get(data_url)
          .success(function(data, status, headers, config) {
            $scope.diagnosi = data || {};
            $scope.master   = angular.copy($scope.diagnosi);
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nel caricamento della diagnosi del paziente.\nControlla la connessione al server!");
            $scope.diagnosi = $scope.master = {};
          });
      };

      $scope.decodeTipoRisposta = function(tr) {
        var img_txt = '';
        switch(tr.risposta) {
          case "si"   : img_txt = 'ok-sign';        break;
          case "no"   : img_txt = 'minus-sign';     break;
          case "forse": img_txt = 'question-sign';  break;
        }
        return '<i class=\".glyphicon..glyphicon-' + img_txt + '\"></i>&nbsp;' + tr;
      }

      $scope.getTipiRisposta = function() {
        var tipi_risp = _.map($scope.tipo_risposta, function(ts) {
          switch(ts.risposta) {}
        });
        return tipi_risp;
      }

      $scope.Cancel = function() {
        $scope.diagnosi = angular.copy( $scope.master );
        // or call $scope.Init() to reload
      };
      
      $scope.dataDiagnosiValida = function(_d) {
        // http://angular-ui.github.io/ui-utils/
        // https://github.com/angular-ui/ui-utils#validate
        var d = moment(_d, 'dd-mm-YYYY');
        if( !d.isValid() )
          return false;

        var min = moment().subtract('years',10);
        var max = moment();

        if( d.isBefore(min) )
          return false;
        if( d.isAfter(max) )
          return false;
      };

      $scope.Save = function() {
        $scope.formState.saving = true;
        // check of diagnosi_malattia before save

        // allign the values
        decodeCodesInObject($scope.diagnosi, $scope.malattia_ric)
          .where('cod_malattia').is_to('idtipo_malattia')
          .as('malattia').is_to('descrizione')
          .by('cod_malattia');

        $http.post(data_url, $scope.diagnosi)
          .success(function(data, status, headers, config) {
                growl.addSuccessMessage("Diagnosi salvata con successo");
                $scope.formState.saving = false;
                Init();
              })
              .error(function(data, status, headers, config) {
                var msg  = "Salvataggio della diagnosi fallito!<br>";
                    msg += "data:   " + data + "<br>";
                    msg += "status: " + status;
                growl.addErrorMessage(msg);
                $scope.formState.saving = false;
              });
      };

      $scope.isUnchanged  = function(diagnosi) {
        return angular.equals($scope.master, diagnosi);
      }

      // calendar management
      var cal = calendar($scope);
      $scope.openCalendar = cal.open;
      $scope.today        = cal.today;

      Init();
    }
  ]);

}());