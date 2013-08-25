var PazienteDettaglioCtrl =  [
  '$scope', '$location', '$routeParams','Restangular',
  function($scope,$location, $routeParams,Restangular) {
    Restangular.one('pazienti', $routeParams.idPaziente).get()
      .then(function(paziente){
        $scope.paziente = paziente[0];
      });    
  }
];