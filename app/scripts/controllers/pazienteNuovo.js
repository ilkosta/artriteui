(function (){

  var mod = angular.module('app.controllers');
  
  mod.controller('PazientiNuovoCtrl', [
    '$scope', function($scope) {
      $scope.master = {};
      $scope.update = function(user) {
        return $scope.master = angular.copy(user);
      };
      $scope.reset = function() {
        return $scope.user = angular.copy($scope.master);
      };
      return $scope.reset();
    }
  ]);

}());