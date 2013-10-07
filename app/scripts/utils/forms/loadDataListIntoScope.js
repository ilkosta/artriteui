(function (){

  var mod = angular.module('utils_forms');

  mod.factory('loadDataListIntoScope',
    ['$http', function($http) {
      return function($scope, data_array, fn_url, fn_param_name) {
        fn_url        = fn_url        || function(p) {return p;}
        fn_param_name = fn_param_name || function(p) {return p;}
        
        _(data_array).each( function(param) {              
          var url = fn_url(param);
          var param_name = fn_param_name(param);
          
          $http({method:'GET', url: url, cache:'true'})
          .success( function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope[param_name] = data;
          })
          .error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.        
            console.log('errore invocando: GET ' + url);
            _([data, status, headers, config]).each(console.log);
          });
        });
      }
    }]);

}());
