var terapie_preCtrl = [
  '$scope','$routeParams', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window','$log','growl', 
  function($scope, $routeParams, 
        $timeout, $http,loadDataListIntoScope,
        $window,$log, growl) { 

	 // parametri: _farmaci_dimard 
     loadDataListIntoScope(
        $scope,
        [ 'farmaci_dimard','farmaci_biologici' ],
        function(p) { return '/data/_' + p;}
      );


  function init() {
      $scope.formState = {};
      $scope.terapie_dimard={};
      $scope.terapie_bio={};

      // load fattori di rischio (da pazienti/:id/terapie_pre)
      $http.get('data/pazienti/' + $routeParams.idPaziente + '/terapie_pre')
      .success(function(data, status, headers, config) {
         $scope.farmaci_pre = [];
         if(data.length >0){        
            $scope.master_tc = data;
            $scope.farmaci_pre  = data;
          }
        })
      .error(function(data, status, headers, config) {
        $log.error('lettura dei terapia farmacologia precedente non riuscita!');
        growl.addErrorMessage('Lettura della terapia farmacologia prececente non riuscita! \nControlla che il server sia attivo!');
        });

  }
  $scope.salvaBio = function(terapie_bio){
    $scope.terapie_dimard=$scope.terapie_bio;
    $scope.salvaDmard(terapie_bio);

  }

  $scope.salvaDmard = function(terapie_dimard){
      $scope.formState.saving = true;
      $scope.terapie_dimard.id_paziente = $routeParams.idPaziente;
      var save =1;
      
      if(!$scope.terapie_dimard.cod_tipo_farmaco){
          growl.addErrorMessage('Farmaco dimard Obbligatoria');
          $scope.formState.saving = false;
          save=0;
      }
      if(save == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapie_pre', $scope.terapie_dimard )
            .success(function(data, status, headers, config) {
                    $log.info('salvataggio della terapia farmacologia prececente avvenuta con successo');
                    growl.addSuccessMessage('Salvataggio della terapia farmacologia prececente avvenuto con successo');
                    $scope.formState.saving = false;  
                    init();                  
              })
            .error(function(data, status, headers, config) {              
                $log.error('salvataggio non riuscito: ');
                growl.addErrorMessage('Aggiornamento non riuscito della terapia farmacologia prececente del paziente :' + $routeParams.idPaziente);
                $scope.formState.saving = false;
              });
      }
    }
  $scope.elimina_pre = function(f){ 
       var del =1;
        if(!f.idterapia_farmacologica_pre){
          growl.addErrorMessage('Tipo terapia farmacologica Obbligatoria');
          $scope.formState.saving = false;
          del=0;
        }
        if(f.idPaziente==null)
          f.idPaziente =$routeParams.idPaziente;
        if(del == 1){      
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapie_pre/cancella', f )
            .success(function(data, status, headers, config) {
                $log.info('eliminazione della terapia farmacologia prececente avvenuto con successo');
                growl.addSuccessMessage('Eliminazione della terapia farmacologia prececente avvenuto con successo');
                init();
              })
            .error(function(data, status, headers, config) {              
                $log.error('eliminazione non riuscito: ');
                growl.addErrorMessage('eliminazione non riuscita della terapia farmacologia prececente del paziente :' + $routeParams.idPaziente);
                $scope.formState.saving = false;
              });
        }
      }
      
	    
init();
 }];