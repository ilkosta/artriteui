(function (){

  var mod = angular.module('app.controllers');
  
  mod.controller('PazientiNuovoCtrl', [
    '$scope', '$location', '$routeParams',
    'Restangular', '$http', 'calendar','$log', 'checkCF','growl',
    function(
        $scope,$location, $routeParams,
        Restangular, $http, calendar,$log, checkCF, growl) {
        
      $scope.master = {};
      $scope.formState = {};

      $scope.update = function(user) {
        $scope.save(user);         
      };
      $scope.reset = function() {
        return $scope.user = angular.copy($scope.master);
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
       
        var chk_data = $scope.dataNascitaValida($scope.user.datadinascita);
        if(!chk_data){
            $log.error('Anno di Nascita non valido');
            $scope.formState.saving  = false;
            growl.addErrorMessage('Impossibile salvare il Paziente. DATA DI NASCITA non coerente.');
            return false;
          } 
        if($scope.user.codicefiscale != null){
           var cf_valido = checkCF($scope.user.codicefiscale);
           if(!cf_valido){
              $log.error('CF non valido');
              $scope.formState.saving  = false;
              growl.addErrorMessage('Impossibile salvare il Paziente. CODIFCE FISCALE non valido.');
              return false;
            } 
        }
        $http.post('/data/pazienti/pazientenuovo', $scope.user )
          .success(function(data, status, headers, config) {
              $log.info('salvataggio avvenuto con successo' + user.nome +' ' + user.cognome );
              growl.addSuccessMessage("Paziente " + user.nome +' ' + user.cognome +' salvato  con successo ');
              $scope.formState.saving = false;
              $scope.reset();
              $location.path('/pazienti')       
            })
          .error(function(data, status, headers, config) {              
              $log.error('salvataggio non riuscito; Paziente : ' + user.nome +' ' + user.cognome);
               growl.addErrorMessage('salvataggio non riuscito; Paziente : ' + user.nome +' ' + user.cognome);
              $log.error($scope.tv_aggiungi);
              $scope.formState.saving = false;
            });

      }

    // calendar management
      var cal = calendar($scope);
      $scope.openCalendar = cal.open;
      $scope.today        = cal.today;

      return $scope.reset();
    }
  ]);

}());