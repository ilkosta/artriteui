var PazienteDettaglioCtrl =  [
  '$scope', '$routeParams', '$location', 'Restangular',
  function($scope, $routeParams,$location,Restangular) {
    
    Restangular
      .one('pazienti', $routeParams.idPaziente)
      .get()
      .then(function(pazienti){
        // manage the error (nessun))
        $scope.paziente = pazienti[0];
      });  
      

    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });

    $scope.getClass = function(id) {
      var nrParts = (id.split('/').length - 1);
      var urlParts = $scope.activeNavId.split('/');
      var urlToValidate = '/' + urlParts.slice(-nrParts,urlParts.length).join('/');
      return (urlToValidate === id) ? 'active' : '';
    };



      
  }
];
