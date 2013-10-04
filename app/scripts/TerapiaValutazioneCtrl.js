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


     $scope.t_aggiungi ={};   
     $scope.aggiungi_t = function() {
      debugger;
      if(!$scope.t_aggiungi.tempo)  return;

      if(_.find($scope.terapia_valutazione, function(t){
        return t.tempo ==$scope.t_aggiungi.tempo;
      })) 
        return;

      var t_nuova = {
          tempo: t_aggiungi.tempo,
          id_paziente : t_aggiungi.id_paziente
      };
      $scope.terapia_valutazione.push(tc_nuova);
      
     };

     $scope.elimina_t = function(t) {
      $window._.remove($scope.terapie_valutazione, function(tv) {
        return tv.tempo === t.tempo;
      });
     };


    }    
];
