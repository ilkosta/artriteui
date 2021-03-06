(function (){
var mod = angular.module('app.controllers');

  mod.controller('TerapiaValutazioneCtrl', [
  '$scope','$routeParams', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window','$log', 'growl', 
    function($scope, $routeParams, $timeout, $http, loadDataListIntoScope,
        $window, $log, growl) {

      var url_tv = '/data/pazienti/' + $routeParams.idPaziente + '/terapia_valutazione';

      $scope.calculateDAS28 = function () {        
        var t28   = $scope.tv_aggiungi.art_dolenti
          , sw28  = $scope.tv_aggiungi.art_tumefatte
          , ESR   = $scope.tv_aggiungi.ves
          , GH    = $scope.tv_aggiungi.vas_paziente ;

        $scope.tv_aggiungi.das28 = (!t28 || !sw28 || !ESR || !GH) 
          ? 0.0 
          : (0.56*Math.sqrt(t28)) + (0.28*Math.sqrt(sw28)) + (0.70*Math.log(ESR)) + (0.014*GH);
      }

      

      // init: non c'è isogno che sia esposta allo $scope
      function init() {
        $scope.formState    = {};
        $scope.tv_aggiungi  = {};

        // $scope.$watch('tv_aggiungi.art_dolenti'   , calculateDAS28());
        // $scope.$watch('tv_aggiungi.art_tumefatte' , calculateDAS28());
        // $scope.$watch('tv_aggiungi.ves'           , calculateDAS28());
        // $scope.$watch('tv_aggiungi.vas_paziente'  , calculateDAS28());

        $http.get(url_tv)
              .success(function(data, status, headers, config) {
                $scope.terapia_valutazione = data;
              })
              .error(function(data, status, headers, config) {
                $log.error('lettura di '+ url_tv +' non riuscita!');
                growl.addErrorMessage("Errore leggendo i dati dal server: " + url_tv 
                                      + '\nControlla che il server sia attivo!');
              });
      }
      
      $scope.elimina_tv = function(t) {
        $http.post(url_tv + '/' + t.tempo + '/cancella', 
                   {id_paziente: $routeParams.idPaziente, tempo: t.tempo}) 
          .success(function(data, status, headers, config) {
            //growl.addSuccessMessage("Cancellata terapia tempo " + t.tempo);
            init();
          })
          .error(function(data, status, headers, config) {
            $log.error('errore nella cancellazione di\n' + t);
            growl.addErrorMessage("errore nella cancellazione della terapia tempo " + t.tempo);
          });
      };
     
      

      $scope.canSave = function(on_save) {
        var notify_err = function(what) {
          if(on_save) 
            $log.error(what);
        };

        //-------------------------------
        // controlli
        //-------------------------------
        // tempo
        if(0 !== ($scope.tv_aggiungi.tempo % 6)) {
          notify_err('tempo % 6 errato');
          return false;
        }

        if( $window._.some($scope.terapia_valutazione, function(r) { 
          return r.tempo === $scope.tv_aggiungi.tempo}) ) {
          notify_err('tempo già esistente: ' + $scope.tv_aggiungi.tempo);
          return false;
        }

        // dati obbligatori
        // var obbligatori = [ $scope.tv_aggiungi.tempo,
        //                     $scope.tv_aggiungi.art_tumefatte,
        //                     $scope.tv_aggiungi.art_dolenti,
        //                     $scope.tv_aggiungi.ves,
        //                     $scope.tv_aggiungi.vas_medico,
        //                     $scope.tv_aggiungi.vas_paziente,
        //                     $scope.tv_aggiungi.pcr ];

        var obbligatori = [];
        if( $window._.some(obbligatori, function(v) { return v == null; })) {
          notify_err('ci sono valori obbligatori assenti');
          return false;
        }

        return true;
      };

      

      $scope.save = function() {
        // $scope.formState.saving = true;
        // check of diagnosi_malattia before save
        // save on /data/pazienti/:idPaziente/terapia_valutazione
        var on_save = true;
        if(!$scope.canSave(on_save)) {
          growl.addErrorMessage("I dati non possono essere salvati");
          return;
        }

        // disabilito l'aggiungi
        $scope.formState.saving = true;

        $scope.tv_aggiungi.id_paziente = $routeParams.idPaziente;
        
        var msg = '';
        $http.post(url_tv, $scope.tv_aggiungi ).
            success(function(data, status, headers, config) {
              msg = 'salvataggio avvenuto con successo del tempo ' + $scope.tv_aggiungi.tempo;
              $log.info(msg);
              //growl.addSuccessMessage(msg);

              $scope.formState.saving = false;              
              init();
            }).
            error(function(data, status, headers, config) {   
              msg = "salvataggio non riuscito del tempo " + $scope.tv_aggiungi.tempo ;
              growl.addErrorMessage(msg);
              $log.error(msg);
              $log.error($scope.tv_aggiungi);

              $scope.formState.saving = false;
            });
      };


      init();

     }]);
})();
