var TerapiaEditCtrl = [
  '$scope','$routeParams', 'Restangular', 
  '$timeout','openCalendar', '$http','loadDataListIntoScope',
  '$window',
    function($scope, $routeParams, Restangular, 
        $timeout, openCalendar,$http,loadDataListIntoScope,
        $window) {
      Restangular
       .one('pazienti', $routeParams.idPaziente).one('terapia_farmaco').get()
       .then(function(terapia){
            // manage the error (nessun))

          var a = moment();
          var b = moment(terapia[0].data_inizio)
          terapia[0].followUp = a.diff(b, 'month');
          $scope.master = $scope.terapia = terapia[0];
         }); 
      
      $scope.openCalendar = openCalendar($scope);
     // _farmaci_dimard 
     loadDataListIntoScope(
        $scope,
        [ 'farmaci_dimard' ],
        function(p) { return '/data/_' + p;}
      );

      Restangular
       .one('pazienti', $routeParams.idPaziente).one('terapie_concomitanti').getList()
       .then(function(terapie_concomitanti){
            // manage the error (nessun))
          $scope.master_tc = $scope.terapie_concomitanti = terapie_concomitanti;
          });    



     $scope.tc_aggiungi ={};   
     $scope.aggiungi_tc = function() {
      if(!$scope.tc_aggiungi.dose)  return;
      if(!$scope.tc_aggiungi.id_tipo_farmaco)  return;

      if(_.find($scope.terapie_concomitanti, function(t){
        return t.id_tipo_farmaco ==$scope.tc_aggiungi.id_tipo_farmaco;
      })) 
        return;

      var tc_nuova = {
          nome: _.find($scope.farmaci_dimard, function(f) {
            return f.idtipo_farmaco == $scope.tc_aggiungi.id_tipo_farmaco;        
          }).nome,
          id_terapia: $scope.terapia.idterapia,
          id_tipo_farmaco: $scope.tc_aggiungi.id_tipo_farmaco,
          dose: $scope.tc_aggiungi.dose,
          id_paziente: $scope.terapia.id_paziente
      };
      
      $scope.terapie_concomitanti.push(tc_nuova);
      
     };

     $scope.elimina_tc = function(t) {
      $window._.remove($scope.terapie_concomitanti, function(tc) {
        return tc.id_tipo_farmaco === t.id_tipo_farmaco;
      });
     };


    }    
];
