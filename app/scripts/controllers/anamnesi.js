var anamnesiCtrl = [
  '$scope','$routeParams', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window','$log','growl', 
    function($scope, $routeParams, 
        $timeout, $http,loadDataListIntoScope,
        $window,$log, growl) {

    init(); 
     // parametri: _malttia_ptc 
     loadDataListIntoScope(
        $scope,
        [ 'malattia_ptc' ],
        function(p) { return '/data/_' + p;}
      );

      // interazioni della form ...
    function init() {
      $scope.formState = {};
      $scope.tc_aggiungi={};

        // load patologie_concomitanti (da pazienti/:id/patologie_concomitanti)
      $http.get('data/pazienti/' + $routeParams.idPaziente + '/patologie_concomitanti')
      .success(function(data, status, headers, config) {
        $scope.patologie_concomitanti = [];
         if(data.length >0){        
            $scope.master_tc = data;
            $scope.patologie_concomitanti  = data;            
          }
        })
      .error(function(data, status, headers, config) {
        $log.error('lettura di Patologie patologie_concomitanti non riuscita!');
        growl.addErrorMessage('Lettura di patologie_concomitanti non riuscita! \nControlla che il server sia attivo!');
        });

    }
    
    $scope.salvaPatologieConcomitante = function(tc_aggiungi){
        $scope.formState.saving = true;
        $scope.tc_aggiungi.id_paziente = $routeParams.idPaziente;
        var save =1;
        if(!$scope.tc_aggiungi.descrizione) {
          growl.addErrorMessage('Descrizione Obbligatoria');
          save =0;
          $scope.formState.saving = false;
        }
        if(!$scope.tc_aggiungi.idtipo_malattia){
          growl.addErrorMessage('Tipo malattia Obbligatoria');
          $scope.formState.saving = false;
          save=0;
        }
        if(save == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/patologie_concomitanti', $scope.tc_aggiungi )
            .success(function(data, status, headers, config) {
                    $log.info('salvataggio patologie concomitanti avvenuto con successo');
                    //growl.addSuccessMessage('Salvataggio patologie concomitanti avvenuto con successo');
                    $scope.formState.saving = false;    
                    init();
              })
            .error(function(data, status, headers, config) {              
                $log.error('salvataggio non riuscito: ');
                growl.addErrorMessage('Aggiornamento non riuscito per le malattie concomitanti del paziente :' + $routeParams.idPaziente);

                $scope.formState.saving = false;
              });
        }
      } 
    
    $scope.elimina_patologia = function(p){ 
       var del =1;
        if(!p.id_tipo_malattia){
          growl.addErrorMessage('Tipo malattia Obbligatoria');
          $scope.formState.saving = false;
          del=0;
        }
        if(!p.id_paziente)
          p.id_paziente = $routeParams.idPaziente;
        if(del == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/patologie_concomitanti/cancella', p )
            .success(function(data, status, headers, config) {
                $log.info('eliminazione patologie concomitanti avvenuto con successo');
                //growl.addSuccessMessage('Eliminazione patologie concomitanti avvenuto con successo');
                init();
              })
            .error(function(data, status, headers, config) {              
                $log.error('eliminazione non riuscito: ');
                growl.addErrorMessage('eliminazione non riuscito per le malattie concomitanti del paziente :' + $routeParams.idPaziente);
                $scope.formState.saving = false;
              });
        }
      }

}];
