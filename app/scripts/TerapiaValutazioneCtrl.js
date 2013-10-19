var TerapiaValutazioneCtrl = [
  '$scope','$routeParams', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window','$log',
    function($scope, $routeParams,
        $timeout, $http,loadDataListIntoScope,
        $window, $log) {

      // init: non c'è isogno che sia esposta allo $scope
      function init() {
        debugger;
        $scope.formState    = {};
        $scope.tv_aggiungi  = {};

        $http.get('/data/pazienti/' + $routeParams.idPaziente + '/terapia_valutazione')
              .success(function(data, status, headers, config) {
                $scope.terapia_valutazione = data;
              })
              .error(function(data, status, headers, config) {
                $log.error('lettura di /data/pazienti/' + $routeParams.idPaziente + '/terapia_valutazione non riuscita!');
              });
      }
      
      $scope.elimina_t = function(t) {
        $window._.remove($scope.terapie_valutazione, function(tv) {
          return tv.tempo === t.tempo;
        });
      };
     
      $scope.canSave = function() {
        //-------------------------------
        // controlli
        //-------------------------------
        // tempo
        if(!$scope.tv_aggiungi.tempo)  
          return false;

        if(0 !== ($scope.tv_aggiungi.tempo % 6)) {
          $log.error('tempo % 6 errato');
          return false;
        }

        if( $window._.some($scope.terapia_valutazione, function(r) { 
          return r.tempo === $scope.tv_aggiungi.tempo}) ) {
          $log.error('tempo già esistente: ' + $scope.tv_aggiungi.tempo);
          return false;
        }

        // dati obbligatori
        var obbligatori = [ $scope.tv_aggiungi.art_tumefatte,
                            $scope.tv_aggiungi.art_dolenti,
                            $scope.tv_aggiungi.ves,
                            $scope.tv_aggiungi.vas_medico,
                            $scope.tv_aggiungi.vas_paziente,
                            $scope.tv_aggiungi.pcr ];
        if( $window._.some(obbligatori, function(v) { return v == null; })) {
          $log.error('ci sono valori obbligatori assenti');
          return false;
        }

        return true;
      };

      $scope.save = function() {
        // $scope.formState.saving = true;
        // check of diagnosi_malattia before save
        // save on /data/pazienti/:idPaziente/terapia_valutazione

        if(!$scope.canSave()) 
          return;
        // disabilito l'aggiungi
        $scope.formState.saving = true;

        $scope.tv_aggiungi.id_paziente =  $routeParams.idPaziente;

        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapia_valutazione',
          $scope.tv_aggiungi ).
            success(function(data, status, headers, config) {
              $log.info('salvataggio avvenuto con successo');
              $scope.formState.saving = false;
              debugger;
              init();
            }).
            error(function(data, status, headers, config) {              
              $log.error('salvataggio non riuscito: ');
              $log.error($scope.tv_aggiungi);
              $scope.formState.saving = false;
            });
      };


      init();

     }];
