var TerapiaValutazioneCtrl = [
  '$scope','$routeParams', 'Restangular', 
  '$timeout', '$http','loadDataListIntoScope',
  '$window',
    function($scope, $routeParams, Restangular, 
        $timeout, $http,loadDataListIntoScope,
        $window) {
     Restangular
       .one('pazienti', $routeParams.idPaziente).one('terapia_valutazione').getList()
       .then(function(terapia_valutazione){
            // manage the error (nessun))
          $scope.master_tc = $scope.terapia_valutazione = terapia_valutazione;
          });    


     $scope.tv_aggiungi ={};   
     $scope.aggiungi_t = function() {
      if(!$scope.tv_aggiungi.tempo)  return;

      if(_.find($scope.terapia_valutazione, function(t){
        return t.tempo ==$scope.tv_aggiungi.tempo;
      })) 
        return;

      var tv_nuova = {
          tempo: $scope.tv_aggiungi.tempo,
          id_paziente :$routeParams.idPaziente, //$scope.tv_aggiungi.id_paziente,
          art_dolenti:$scope.tv_aggiungi.art_dolenti,
          art_tumefatte:$scope.tv_aggiungi.art_tumefatte,
          pcr:$scope.tv_aggiungi.pcr,
          ves:$scope.tv_aggiungi.ves,
          vas_paziente:$scope.tv_aggiungi.vas_paziente,
          vas_medico:$scope.tv_aggiungi.vas_medico,
          das28:$scope.tv_aggiungi.das28,
          sdai:$scope.tv_aggiungi.sdai,
          cdai:$scope.tv_aggiungi.cdai
      };
      $scope.terapia_valutazione.push(tv_nuova);
      
     };

     $scope.elimina_t = function(t) {
      $window._.remove($scope.terapie_valutazione, function(tv) {
        return tv.tempo === t.tempo;
      });
     };


    }    
];
