var TerapiaEditCtrl = [
  '$scope','$routeParams', 'Restangular', '$timeout','openCalendar', '$http',
    function($scope, $routeParams, Restangular, $timeout, openCalendar,$http) {
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

        Restangular
       .one('pazienti', $routeParams.idPaziente).one('terapie_concomitanti').getList()
       .then(function(terapie_concomitanti){
            // manage the error (nessun))
          $scope.master_tc = $scope.terapie_concomitanti = terapie_concomitanti;
         });    
       
        }    
];
