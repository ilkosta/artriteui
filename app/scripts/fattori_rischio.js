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


      $scope.formState = {};
      $scope.fdr={};
	$scope.salvaFattore = function(fdr){
		debugger;
        $scope.formState.saving = true;
        $scope.fdr.idPaziente = $routeParams.idPaziente;
        var save =1;
        if(!$scope.fdr.idtipo_malattia){
          growl.addErrorMessage('Tipo malattia Obbligatoria');
          $scope.formState.saving = false;
          save=0;
        }
        debugger;
        if(save == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/patologie_concomitanti', $scope.fdr )
            .success(function(data, status, headers, config) {
                    $log.info('salvataggio Fattori di Rischio avvenuto con successo');
                    growl.addSuccessMessage('Salvataggio Fattori di Rischio avvenuto con successo');
                    $scope.formState.saving = false;    
                   
              })
            .error(function(data, status, headers, config) {              
                $log.error('salvataggio non riuscito: ');
                growl.addErrorMessage('Aggiornamento non riuscito per le Fattori di Rischio del paziente :' + $routeParams.idPaziente);
                $scope.formState.saving = false;
              });
        }
      }



    }];