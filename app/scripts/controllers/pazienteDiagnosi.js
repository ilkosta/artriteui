
(function (){
  var mod = angular.module('app.controllers');

  mod.controller('PazienteDiagnosiEditCtrl', [
    '$scope', '$location', '$routeParams','Restangular',
    '$http', 'calendar' , 'sameMaster','loadDataListIntoScope',
    'decodeCodesInObject',
    function(
        $scope,$location, $routeParams,
        Restangular, $http, calendar,
        sameMaster,loadDataListIntoScope,
        decodeCodesInObject) {

      $scope.formState = {};

      var Init = function() {

        loadDataListIntoScope(
          $scope,
          [ 'tipo_risposta' , 'malattia_ric' ],
          function(p) { return '/data/_' + p;}
        );

        Restangular.one('pazienti', $routeParams.idPaziente).one('diagnosimalattia').get()
        .then(function(diagnosi_malattia){
          $scope.diagnosi = diagnosi_malattia;

          $scope.master   = Restangular.copy($scope.diagnosi);
        },
        // err
        function(response) {
          // alert ?
          // funzione comune ?
          console.log(response);
        });
      };


      $scope.Cancel = function() {
        $scope.diagnosi = Restangular.copy( $scope.master );
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

        $scope.diagnosi.put()
          .then(
            // success
            function() {
              console.log('salvataggio avvenuto con successo');
              $scope.formState.saving = false;
            },
            // error
            function() {
              console.log('errore nel salvataggio');
              $scope.formState.saving = false;
          });
      };

      $scope.isUnchanged  = sameMaster($scope);

      // calendar management
      var cal = calendar($scope);
      $scope.openCalendar = cal.open;
      $scope.today        = cal.today;

      Init();
    }
  ]);

}());