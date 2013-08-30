var TerapiaEditCtrl = [
  '$scope','$routeParams', 'Restangular', '$timeout', 
    function($scope, $routeParams, Restangular, $timeout) {
      Restangular
       .one('pazienti', $routeParams.idPaziente).one('terapia_farmaco').get()
       .then(function(terapia){
            // manage the error (nessun))
            $scope.master = $scope.terapia = terapia[0];
          }); 
      
        $scope.openCalendar = function() {
        $timeout( function() {
        $scope.calendarOpened = true;
      });
    }
}];
