angular.module('app').factory( 'openCalendar',
  ['$timeout', // dependencies
  function($timeout) {
    return function($scope) { // factory with the know of $scope
      return function() {
        return $timeout( function() {
          $scope.calendarOpened = true;
        });
      }
  }
}]);

angular.module('app').factory( 'sameMaster',
  function() {
  return function($scope) { // factory with the know of $scope
    //return function(what) {}
    
    return function(what) {
      if( what === undefined ) 
        return false;
      
      //var sm = function() { 
        return angular.equals(what, $scope.master);           
      /*};
      
      return _.debounce(sm, 200);  */
    } 
  }
});

var PazienteDiagnosiCtrl = [
  '$scope', '$location', '$routeParams','Restangular',
  function($scope,$location, $routeParams,Restangular) {
    Restangular.one('pazienti', $routeParams.idPaziente).one('diagnosimalattia').get()
      .then(
        function(diagnosi_malattia){
          $scope.diagnosi_malattia = diagnosi_malattia[0];
        },
        // err
        function(response) {
          // alert ?
          // funzione comune ?
          console.log(response);
        }
      );    
  }
];

var PazienteDiagnosiEditCtrl = [
  '$scope', '$location', '$routeParams','Restangular', '$http', 'openCalendar' , 'sameMaster',
  function($scope,$location, $routeParams,Restangular, $http, openCalendar, sameMaster) {
    
    $scope.Init = function() {
      $scope.dateOptions = {
        'year-format': "'yyyy'",
        'starting-day': 1
      };
    
      // load of parameters (cached)    
      _([ 'tipo_risposta' , 'malattia_ric' ])
      .each( function(param) {
        var url = '/data/_' + param;
        
        $http({method:'GET', url: url, cache:'true'})
        .success( function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope[param] = data;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.        
          console.log('errore invocando: GET ' + url);
          _([data, status, headers, config]).each(console.log);
        });
      });
      
      Restangular.one('pazienti', $routeParams.idPaziente).one('diagnosimalattia').get()
      .then(function(diagnosi_malattia){
        $scope.diagnosi = diagnosi_malattia;  
        
        $scope.master   = Restangular.copy($scope.diagnosi);        
      },
      // err
      function(response) {
        // alert ?
        // funzione comune ?
        console.log(response);
      });
    }
    
    $scope.Cancel = function() {
      $scope.diagnosi = Restangular.copy( $scope.master );
      // or call $scope.Init() to reload
    }
    
    
    $scope.Save = function() {
      // check of diagnosi_malattia before save
      
      $scope.diagnosi.put()
        .then(
          // success
          function() {
            console.log('salvataggio avvenuto con successo');
          }, 
          // error
          function() {
            console.log('errore nel salvataggio');
        });
    }
    
    $scope.isUnchanged  = sameMaster($scope);    
    $scope.openCalendar = openCalendar($scope);
    
    $scope.Init();
    
  }
];