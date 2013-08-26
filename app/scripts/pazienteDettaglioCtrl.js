var PazienteDettaglioCtrl =  [
  '$scope', '$routeParams','Restangular',
  function($scope, $routeParams,Restangular) {
    
    Restangular
      .one('pazienti', $routeParams.idPaziente)
      .get()
      .then(function(pazienti){
        // manage the error (nessun))
        $scope.paziente = pazienti[0];
      });  
      
  }
];