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
    .each( function(fattori_rischio) {
        $http({method:'GET', url: '/data/_fattori_rischio', cache:'true'})
        .success( function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.fattori_rischio = data;
        })
      });
}];
