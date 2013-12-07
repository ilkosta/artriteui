angular.module('utils_bootstrap',[]) // create the module
       .factory( 'calendar',
  ['$timeout', // dependencies
  function($timeout) {
    return function($scope) { // factory with the know of $scope
      return {

        init: function(options) {
          $scope.dateOptions = options || {
    //         'year-format': "'yyyy'",
             'starting-day': 1,
             'month-format': 'MM'
          };
        },
        
        open: function() {
          return $timeout( function() {
            $scope.calendarOpened = true;
          });
        },

        today: moment()
      }
  }
}]);
