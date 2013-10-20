(function (){

  var mod = angular.module('app.controllers');
  
  mod.controller('PazientiNuovoCtrl', [
    '$scope', '$location', '$routeParams',
    'Restangular', '$http', 'calendar','$log', 
    function(
        $scope,$location, $routeParams,
        Restangular, $http, calendar,$log) {
        
      $scope.master = {};
      $scope.formState = {};

      $scope.update = function(user) {
        $scope.save(user);         
      };
      $scope.reset = function() {
        return $scope.user = angular.copy($scope.master);
      };
      
      $scope.save = function(user) {
        $scope.formState.saving = true;
        $http.post('/data/pazienti/pazientenuovo', $scope.user )
          .success(function(data, status, headers, config) {
              $log.info('salvataggio avvenuto con successo');
              $scope.formState.saving = false;
              debugger;
              $scope.reset();
                          
            })
          .error(function(data, status, headers, config) {              
              $log.error('salvataggio non riuscito: ');
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