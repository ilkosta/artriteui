var TerapiaEditCtrl = [
  '$scope','$routeParams', 
  '$timeout','openCalendar', '$http','loadDataListIntoScope',
  '$window','$log',
    function($scope, $routeParams, 
        $timeout, openCalendar,$http,loadDataListIntoScope,
        $window,$log) {

      // constraints
      var tc_unchanged = function() {
        return angular.equals($scope.terapie_concomitanti, $scope.master_tc);
      };

      $http.get('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco')
      .success(function(data, status, headers, config) {
     
        $scope.terapia = {};
        if(data.length >0){            
            $scope.master   = data[0];
            $scope.terapia  = data[0];
          }
        })
      .error(function(data, status, headers, config) {
        $log.error('lettura di Terapia Paziente non riuscita!');
        });

      $scope.openCalendar = openCalendar($scope);
     
     // parametri: _farmaci_dimard 
     loadDataListIntoScope(
        $scope,
        [ 'farmaci_dimard' ],
        function(p) { return '/data/_' + p;}
      );

      // load terapie_concomitanti (da pazienti/:id/terapie_concomitanti)
      $http.get('data/pazienti/' + $routeParams.idPaziente + '/terapie_concomitanti')
      .success(function(data, status, headers, config) {
        $scope.terapie_concomitanti = [];
         if(data.length >0){        
            $scope.master_tc = data;
            $scope.terapie_concomitanti  = data;
            // vado avanti a inizializzare terapie_concomitanti
            $scope.terapie_concomitanti.unchanged = tc_unchanged;
          }
        })
      .error(function(data, status, headers, config) {
        $log.error('lettura di Terapia terapie_concomitanti non riuscita!');
        });

  
      // interazioni della form ...
      $scope.formState = {};
      $scope.Save = function() {
        $scope.formState.saving = true;
        // fai controlli di validità
        if($scope.terapia.data_inizio == null)
           {$log.error('data terapia obbligatoria');return false;} 

        if($scope.terapia.id_paziente == null)
            {$scope.terapia.id_paziente = $routeParams.idPaziente;}
        if($scope.terapia.idterapia > 0){
            $http.put('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco', $scope.terapia )
                .success(function(data, status, headers, config) {
                    $log.info('Aggiornamento avvenuto con successo');
                    $scope.formState.saving = false;    
                    salvaTerapiaConcomitante($scope.terapia.idterapia);
                  })
                .error(function(data, status, headers, config) {              
                    $log.error('Aggiornamento non riuscito: ');
                    $scope.formState.saving = false;

                });
        }
        else {
               $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco', $scope.terapia )
              .success(function(data, status, headers, config) {
                  $log.info('salvataggio avvenuto con successo');
                  $scope.formState.saving = false;   
                  salvaTerapiaConcomitante(data.insertId); 
                })
              .error(function(data, status, headers, config) {              
                  $log.error('salvataggio non riuscito: ');
                  $scope.formState.saving = false;
                });
        }
        // allinea gli ultimi valori prima del salvataggio
       };
 
       var salvaTerapiaConcomitante = function(idTerapia){
        var terapie_concomitanti = _.map($scope.terapie_concomitanti, function(it){
            it.id_terapia = idTerapia;
            return it;
        }) ;

        if(terapie_concomitanti.length > 0)
         $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapie_concomitanti', terapie_concomitanti )
            .success(function(data, status, headers, config) {
                $log.info('salvataggio avvenuto con successo');
                $scope.formState.saving = false;    
              })
            .error(function(data, status, headers, config) {              
                $log.error('salvataggio non riuscito: ');
                $scope.formState.saving = false;
              });
       }


      $scope.Cancel = function() {
        $scope.terapie_concomitanti =  Restangular.copy($scope.master_tc);
        $scope.terapie_concomitanti.unchanged = tc_unchanged;
      };

     $scope.tc_aggiungi ={};   
     $scope.aggiungi_tc = function() {
      if(!$scope.tc_aggiungi.dose)  return;
      if(!$scope.tc_aggiungi.id_tipo_farmaco)  return;

      if(_.find($scope.terapie_concomitanti, function(t){
        return t.id_tipo_farmaco ==$scope.tc_aggiungi.id_tipo_farmaco;
      })) 
        return;

      var tc_nuova = {
          nome: _.find($scope.farmaci_dimard, function(f) {
            return f.idtipo_farmaco == $scope.tc_aggiungi.id_tipo_farmaco;        
          }).nome,
          id_terapia: $scope.terapia.idterapia,
          id_tipo_farmaco: $scope.tc_aggiungi.id_tipo_farmaco,
          dose: $scope.tc_aggiungi.dose,
          id_paziente: $scope.terapia.id_paziente
      };
      
      $scope.terapie_concomitanti.push(tc_nuova);
      
    };

    $scope.elimina_tc = function(t) {
      $window._.remove($scope.terapie_concomitanti, function(tc) {
        return tc.id_tipo_farmaco === t.id_tipo_farmaco;
      });
    };


    }    
];
