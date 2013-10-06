angular.module('utils').factory( 'openCalendar',
  ['$timeout', // dependencies
  function($timeout) {
    return function($scope) { // factory with the know of $scope
      return function() {
        return $timeout( function() {
          $scope.calendarOpened = true;
        });
      }
  }
}]);
