var momentFilters = angular.module('momentFilters',[]);

momentFilters.filter('fromNow', function() {
  return function(dateString) {
    return (dateString != null) ? moment(dateString).fromNow() : '';
  };
});
// moment filter factory
function getMomentDiffBy(param) {
  return function() {
    return function(dateString) {
      
      if(dateString == null) 
        return '';

      var a = moment();
      var b = moment(dateString);
      return a.diff(b, param);
    };
  };
};



// yearsFromNow, monthsFromNow, daysFromNow
_([
  {filter_name:'yearsFromNow', param: 'year'}
, {filter_name:'monthsFromNow', param: 'month'}
, {filter_name:'daysFromNow', param: 'day'}
]).each( function(filter_params) {
  momentFilters.filter( filter_params.filter_name, getMomentDiffBy(filter_params.param) );
});
