(function (){
var mod = angular.module('app.controllers');

  mod.controller('EsamiLaboratorioCtrl', [
  '$scope','$routeParams', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window','$log', 'growl', 'calendar',
    function($scope, $routeParams, $timeout, $http, loadDataListIntoScope,
        $window, $log, growl,calendar) {

      var url_el = '/data/pazienti/' + $routeParams.idPaziente + '/esami_laboratorio';

      // init: non c'è isogno che sia esposta allo $scope
      function init() {
        $scope.formState    = {};
        $scope.el_aggiungi  = {};
        calendar().init($scope);
        $http.get(url_el)
              .success(function(data, status, headers, config) {
                $scope.esami_laboratorio = data;
              })
              .error(function(data, status, headers, config) {
                $log.error('lettura di '+ url_el +' non riuscita!');
                growl.addErrorMessage("Errore leggendo i dati dal server: " + url_el 
                                      + '\nControlla che il server sia attivo!');
              });
      }
      
      $scope.elimina_el = function(t) {
        $http.post(url_el + '/' + t.tempo + '/cancella', 
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
        
        if( $window._.some($scope.esami_laboratorio, function(r) { 
          return r.tempo === $scope.el_aggiungi.tempo}) ) {
          notify_err('tempo già esistente: ' + $scope.el_aggiungi.tempo);
          return false;
        }

         var obbligatori = [];
        if( $window._.some(obbligatori, function(v) { return v == null; })) {
          notify_err('Ci sono valori obbligatori assenti');
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

        $scope.el_aggiungi.id_paziente = $routeParams.idPaziente;
        if($scope.el_aggiungi.tempo != null)
          {  
          
          var msg = '';
          $http.post(url_el, $scope.el_aggiungi ).
              success(function(data, status, headers, config) {
                msg = 'salvataggio avvenuto con successo del tempo ' + $scope.el_aggiungi.tempo;
                $log.info(msg);
                growl.addSuccessMessage(msg);

                $scope.formState.saving = false;              
                init();
              }).
              error(function(data, status, headers, config) {   
                msg = "salvataggio non riuscito del tempo " + $scope.el_aggiungi.tempo ;
                growl.addErrorMessage(msg);
                $log.error(msg);
                $log.error($scope.el_aggiungi);

                $scope.formState.saving = false;
              });
          }else{growl.addErrorMessage("Impossibile salvare. TEMPO obbligatorio.");
          $log.error("Impossibile salvare. TEMPO obbligatorio.");
          $scope.formState.saving = false;}
      };


      init();

     }]);
})();
