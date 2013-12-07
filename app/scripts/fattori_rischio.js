var fattoriRischioCtrl = [
  '$scope','$routeParams', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window','$log','growl', 
  function($scope, $routeParams, 
        $timeout, $http,loadDataListIntoScope,
        $window,$log, growl) { 



	// parametri: _fattori_rischio 
  loadDataListIntoScope(
        $scope,
        [ 'fattori_rischio' ],
        function(p) { return '/data/_' + p;}
      );

  function init() {
      $scope.formState = {};
      $scope.fdr={};

      // load fattori di rischio (da pazienti/:id/fattori_di_rischio)
      $http.get('data/pazienti/' + $routeParams.idPaziente + '/fattori_di_rischio')
      .success(function(data, status, headers, config) {
         $scope.fattori_di_rischio = [];
         if(data.length >0){        
            $scope.master_tc = data;
            $scope.fattori_di_rischio  = data;
          }
        })
      .error(function(data, status, headers, config) {
        $log.error('lettura dei fattori di rischio non riuscita!');
        growl.addErrorMessage('Lettura dei fattori di rischio non riuscita! \nControlla che il server sia attivo!');
        });

  }

      
	  $scope.salvaFattore = function(fdr){
	    $scope.formState.saving = true;
      $scope.fdr.idPaziente = $routeParams.idPaziente;
      var save =1;
      if(!$scope.fdr.idtipo_malattia){
          growl.addErrorMessage('Tipo malattia Obbligatoria');
          $scope.formState.saving = false;
          save=0;
      }
      if(save == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/patologie_concomitanti', $scope.fdr )
            .success(function(data, status, headers, config) {
                    $log.info('salvataggio Fattori di Rischio avvenuto con successo');
                    growl.addSuccessMessage('Salvataggio Fattori di Rischio avvenuto con successo');
                    $scope.formState.saving = false;  
                    init();                  
              })
            .error(function(data, status, headers, config) {              
                $log.error('salvataggio non riuscito: ');
                growl.addErrorMessage('Aggiornamento non riuscito per le Fattori di Rischio del paziente :' + $routeParams.idPaziente);
                $scope.formState.saving = false;
              });
      }
    }
  $scope.elimina_fattore = function(f){ 
       var del =1;
        if(!f.idpatologia_concomitante){
          growl.addErrorMessage('Tipo malattia Obbligatoria');
          $scope.formState.saving = false;
          del=0;
        }
        if(f.id_paziente==null)
          f.id_paziente =$routeParams.idPaziente;
        if(del == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/patologie_concomitanti/cancella', f )
            .success(function(data, status, headers, config) {
                $log.info('eliminazione fattore di richio avvenuto con successo');
                growl.addSuccessMessage('Eliminazione fattore di rischio avvenuto con successo');
                init();
              })
            .error(function(data, status, headers, config) {              
                $log.error('eliminazione non riuscito: ');
                growl.addErrorMessage('eliminazione non riuscito per i fattori di rischio del paziente :' + $routeParams.idPaziente);
                $scope.formState.saving = false;
              });
        }
      }
init();
 }];