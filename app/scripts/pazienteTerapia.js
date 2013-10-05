var TerapiaEditCtrl = [
  '$scope','$routeParams', 'Restangular', 
  '$timeout','openCalendar', '$http','loadDataListIntoScope',
  '$window',
    function($scope, $routeParams, Restangular, 
        $timeout, openCalendar,$http,loadDataListIntoScope,
        $window) {

      // constraints
      var tc_unchanged = function() {
        return angular.equals($scope.terapie_concomitanti, $scope.master_tc);
      };


      // load terapia (da pazienti/:id/terpia_farmaco)
      Restangular
       .one('pazienti', $routeParams.idPaziente).one('terapia_farmaco').get()
       .then(function(terapia){
            // manage the error (nessun))

          var a = moment();
          var b = moment(terapia[0].data_inizio)
          terapia[0].followUp = a.diff(b, 'month');
          $scope.master   = Restangular.copy(terapia[0]);
          $scope.terapia  = Restangular.copy(terapia[0]);
         }); 

      $scope.openCalendar = openCalendar($scope);
     
     // parametri: _farmaci_dimard 
     loadDataListIntoScope(
        $scope,
        [ 'farmaci_dimard' ],
        function(p) { return '/data/_' + p;}
      );

      // load terapie_concomitanti (da pazienti/:id/terapie_concomitanti)
      Restangular
      .one('pazienti', $routeParams.idPaziente).one('terapie_concomitanti').getList()
      .then(function(terapie_concomitanti){
        // TODO: manage the error (nessun))
        $scope.master_tc =  Restangular.copy(terapie_concomitanti);
        $scope.terapie_concomitanti =  Restangular.copy(terapie_concomitanti);

        // vado avanti a inizializzare terapie_concomitanti
        $scope.terapie_concomitanti.unchanged = tc_unchanged;
      });    

      
      // interazioni della form ...
      $scope.formState = {};
      $scope.Save = function() {
        $scope.formState.saving = true;

        // fai controlli di validità

        // allinea gli uiltimi valori prima del salvataggio

        $scope.formState.saving = false;        
      };


      $scope.Cancel = function() {
        $scope.terapie_concomitanti =  Restangular.copy($scope.master_tc);
        $scope.terapie_concomitanti.unchanged = tc_unchanged;
      };

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
