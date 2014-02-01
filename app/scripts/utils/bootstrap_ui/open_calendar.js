angular.module('utils_bootstrap',[]) // create the module
       .factory( 'calendar', ['datepickerPopupConfig',
  function() {
    return function() {
      return {
        init: function($scope, options) { 
          $scope.dateOptions = options || {
    //         'year-format': "'yyyy'",
             'starting-day': 1,
             'month-format': 'MM',
             'popup': '"dd-MM-yyyy"',
             'show-button-bar': true,
             'current-text': 'Oggi'
          }; 

          $scope.openCalendar = function() {
            return $timeout( function() {
              $scope.calendarOpened = true;
            });
          };

          $scope.today = new Date();
        }
      };
    };
  }]);
