angular.module('app').factory( 'sameMaster',
  function() {
  return function($scope) { // factory with the know of $scope
    //return function(what) {}
    
    return function(what) {
      if( what === undefined ) 
        return false;
      
      //var sm = function() { 
        return angular.equals(what, $scope.master);           
      /*};
      
      return _.debounce(sm, 200);  */
    } 
  }
});
