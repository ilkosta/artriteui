angular.module('utils').factory( 'activeForCurrentRoute',
  function($timeout) {
    return function($scope) { // factory with the know of $scope
      return function(id) {
	      var nrParts = (id.split('/').length - 1);
	      var urlParts = $scope.activeNavId.split('/');
	      var urlToValidate = '/' + urlParts.slice(-nrParts,urlParts.length).join('/');
	      return (urlToValidate === id) ? 'active' : '';
	    };
  	}
});
