angular.module('utils').factory( 'checkDB',
  ['$http', '$location', 
  function($http,$location) {
    return function() {
      $http({method:'GET', url: '/data/pazienti'})
        .success( function(data, status, headers, config) {
          // all seems ok...
          return true;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.        
          console.log('errore invocando: GET ' + '/data/pazienti');
          _([data, status, headers, config]).each(console.log);
          
          $location.url = '/no_connessione_DB';
          return false;
        });
    }
  
}]);
