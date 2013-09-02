angular.module('utils').factory( 'checkServer',
  ['$http', '$location', 'checkDB',
  function($http, $location, checkDB ) {
    return function() {
      $http({method:'GET', url: '/data/ping.json'})
        .success( function(data, status, headers, config) {
          if(data.length === 1 && data[0].it_work)
            return checkDB();
          else 
            $location.url = '/no_connessione';
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.        
          console.log('errore invocando: GET ' + '/data/ping.json');
          _([data, status, headers, config]).each(console.log);
          
          $location.url = '/no_connessione';
          return false;
        });
    }
  
}]);
