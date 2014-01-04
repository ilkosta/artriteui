var momentFilters = angular.module('momentFilters',[]);

momentFilters.filter('fromNow', function() {
  return function(dateString) {
    return (dateString) ? moment(dateString).fromNow() : '';
  };
});

momentFilters.filter('fromNowPrecisely', function() {
  return function(dateString) {
    if(!dateString)
      return '';
    var now = moment()
      , dateParam = moment(dateString)
      , years = now.diff(dateParam, 'year')
      , afterYears = dateParam.add('years',years)
      , months = now.diff(afterYears, 'month')
      , days  = now.diff(afterYears.add('months',months), 'day');
    
    var s = (years > 0) ? '' + years + ' anni' : '';
        s += (months > 0) ? ((s.length > 0) ? ', ': '') + months + ' mesi' : '';
        s += (days > 0) ? ((s.length > 0) ? ' e ': '') + days + ' giorni' : '';
        s += (s.length === 0) ? 'oggi' : ' fa';

    return s;
  };
});


// moment filter factory
function getMomentDiffBy(param) {
  return function() {
    return function(dateString) {
      
      if(dateString === null) 
        return '';

      var a = moment();
      var b = moment(dateString);
      return a.diff(b, param);
    };
  };
}



// yearsFromNow, monthsFromNow, daysFromNow
_([
  {filter_name:'yearsFromNow', param: 'year'}
, {filter_name:'monthsFromNow', param: 'month'}
, {filter_name:'daysFromNow', param: 'day'}
]).each( function(filter_params) {
  momentFilters.filter( filter_params.filter_name, getMomentDiffBy(filter_params.param) );
});
