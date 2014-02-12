(function (){

  var mod = angular.module('app.controllers');
  
  mod.controller('PazienteModificaCtrl', [
    '$scope', '$location', '$routeParams',
    '$http', 'calendar','$log', 'checkCF','growl',
    function(
        $scope,$location, $routeParams,
        $http, calendar,$log, checkCF, growl) {
        
      init(); 
  
  // interazioni della form ...
    function init() {
      $scope.master = {};
      $scope.formState = {};

    // load paziente (da pazienti/:id/paziente_modifica)
      $http.get('data/pazienti/' + $routeParams.idPaziente + '/paziente_modifica')
      .success(function(data, status, headers, config) {
        $scope.user = [];
         if(data.length >0){        
            $scope.master = data;
            $scope.user  = data;            
          }
         else {
            growl.addErrorMessage('Lettura di paziente non riuscita!');
            $location.path('/pazienti')    
         }
        })
      .error(function(data, status, headers, config) {
        $log.error('lettura di paziente non riuscita!');
        growl.addErrorMessage('Lettura di paziente non riuscita! \nControlla che il server sia attivo!');
        });

    }

      $scope.update = function(user) {
        $scope.save(user);         
      };

      $scope.elimina = function(user) {
        $scope.delete(user);         
      };
          

      $scope.dataNascitaValida = function(_d) {
        // http://angular-ui.github.io/ui-utils/
        // https://github.com/angular-ui/ui-utils#validate
        var d = moment(_d).format('DD-MM-YYYY');
        
        var min_anno = moment().year() - 120;
        var max_anno = moment().year() - 10;
        var anno = moment(d).year();
        if(anno >max_anno || anno < min_anno)
          return false;
        return true;
      };


      $scope.save = function(user) {
        $scope.formState.saving = true;

        var chk_data = $scope.dataNascitaValida($scope.user[0].DATA_NASCITA);
        if(!chk_data){
            $log.error('Anno di Nascita non valido');
            $scope.formState.saving  = false;
            growl.addErrorMessage('Impossibile salvare il Paziente. DATA DI NASCITA non coerente.');
            return false;
          } 
        if($scope.user[0].CODICE_FISCALE != null){
           var cf_valido = checkCF($scope.user[0].CODICE_FISCALE);
           if(!cf_valido){
              $log.error('CF non valido');
              $scope.formState.saving  = false;
              growl.addErrorMessage('Impossibile salvare il Paziente. CODIFCE FISCALE non valido.');
              return false;
            } 
        }
        $http.put('/data/pazienti/' + $routeParams.idPaziente + '/paziente_modifica', $scope.user[0] )
          .success(function(data, status, headers, config) {
              $log.info('salvataggio avvenuto con successo' + user[0].NOME +' ' + user[0].COGNOME );
              growl.addSuccessMessage("Paziente " + user[0].NOME +' ' + user[0].COGNOME +' salvato  con successo ');
              $scope.formState.saving = false;
              // $scope.reset();
              // $location.path('/pazienti')       
            })
          .error(function(data, status, headers, config) {              
              $log.error('salvataggio non riuscito; Paziente : ' + user[0].NOME +' ' + user[0].COGNOME);
               growl.addErrorMessage('salvataggio non riuscito; Paziente : ' + user[0].NOME +' ' + user[0].COGNOME);
              $log.error($scope.user);
              $scope.formState.saving = false;
            });

      }

      $scope.delete = function(user) {
        $scope.formState.saving = true;
        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/paziente_modifica', $scope.user[0] )
            .success(function(data, status, headers, config) {
                $log.info('Eliminazione avvenuta con successo' + user[0].NOME +' ' + user[0].COGNOME );
                growl.addSuccessMessage("Paziente " + $routeParams.idPaziente+ " - "  + user[0].NOME +' ' + user[0].COGNOME +' eliminato. ');
                $scope.formState.saving = false;
                $location.path('/pazienti') 
                    
            })
          .error(function(data, status, headers, config) {              
              $log.error('salvataggio non riuscito; Paziente : ' + user[0].NOME +' ' + user[0].COGNOME);
               growl.addErrorMessage('Eliminazione non riuscita; Paziente : ' + user[0].NOME +' ' + user[0].COGNOME);
              $log.error($scope.user[0]);
              $scope.formState.saving = false;
            });

      }










    // calendar management
      var cal = calendar($scope);
      $scope.openCalendar = cal.open;
      $scope.today        = cal.today;

      // return $scope.reset();
    }
  ]);

}());