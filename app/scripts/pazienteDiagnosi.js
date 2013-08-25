var PazienteDiagnosiCtrl = [
  '$scope', '$location', '$routeParams','Restangular',
  function($scope,$location, $routeParams,Restangular) {
    Restangular.one('pazienti', $routeParams.idPaziente).one('diagnosimalattia').get()
      .then(function(diagnosi_malattia){
        $scope.diagnosi_malattia = diagnosi_malattia[0];
      });    
  }
];