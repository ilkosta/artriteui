'use strict';

/* Controllers
*/
var AppCtrl = [ 
  '$scope', '$location', '$resource', '$rootScope', function($scope, $location, $resource, $rootScope) {
    $scope.$location = $location;
    $scope.$watch('$location.path()', function(path) {
      return $scope.activeNavId = path || '/';
    });
    return $scope.getClass = function(id) {
      if ($scope.activeNavId.substring(0, id.length) === id) {
        return 'active';
      } else {
        return '';
      }
    };
  }
];


function dateConverter(record) {
  var record = record;
  return function convertDates(field) {
    
    function convertDate(date) {
      return ( date!= null) ? moment(date).format('L') : '';    
    }
    
    record[field]
    if(record[field] != null)
      record[field] = convertDate(record[field]);
  }
}

var PazientiElencoCtrl = [
  '$scope', '$http', function($scope, $http) {
    
    $http.get('data/pazienti.json').success(function(data) {
      var dates = ['DATA_DIAGNOSI', 'DATA_TERAPIA','DATA_NASCITA'];
      var pazienti = _(data).each(function(paziente) {        
        _(dates).each(dateConverter(paziente));
        if(paziente.DATA_DIAGNOSI != null )
          paziente.dalla_data_diagnosi = moment(paziente.DATA_DIAGNOSI).fromNow();
      }).value();
      return $scope.pazienti = pazienti;
    });
    
  }
];

var PazientiNuovoCtrl =  [
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
];
