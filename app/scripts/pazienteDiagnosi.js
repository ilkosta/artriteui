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
  '$scope', '$location', '$routeParams','Restangular', '$http',
  function($scope,$location, $routeParams,Restangular, $http) {
    
    // per TEST
    $scope.diagnosi = {
      malattia: 'artrite psoriasica', 
      fattore_reumatoide:'forse',
      anticorpi: 'si'
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
    
     
    $scope.Init = function() {
      Restangular.one('pazienti', $routeParams.idPaziente).one('diagnosimalattia').get()
      .then(function(diagnosi_malattia){
        $scope.master = $scope.diagnosi_malattia = diagnosi_malattia[0];
      },
      // err
      function(response) {
        // alert ?
        // funzione comune ?
        console.log(response);
      });
    }
    
    $scope.Cancel = function() {
      $scope.diagnosi_malattia = angular.copy( $scope.master );
      // or call $scope.Init() to reload
    }
    
    $scope.Save = function() {
      // check of diagnosi_malattia before save
      
      var server_diagnosimalattia = Restangular
        .one('pazienti', $routeParams.idPaziente)
        .one('diagnosimalattia');
        
      server_diagnosimalattia
        .put($scope.diagnosi_malattia)
        .then(
          // success
          function() {
            
          }, 
          // error
          function() {
            
        });
    }
  }
];


var TerapiaCtrl = function() {}