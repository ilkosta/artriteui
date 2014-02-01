;(function () {
  'use strict';
var moment = require('moment');

var getDate = function(_d) {
  if(!_d)
    return null;

  var d = moment(_d);
  var valid = d.isValid();

  if(!valid)
    return null;

  return moment(_d).format('YYYY-MM-DD')
};

/*
  check if the date _d is inside the range _d1.._d2
  where if not specified:
  _d1: 10 year ago
  _d2: tomorrow
*/
exports.isDateInRange = function(_d, _d1, _d2) {
  if(!_d)
    return false;
  var d = moment(_d);
  var valid = d.isValid();
  if(!valid)
    return false;
  

  var d2 = getDate(_d2) || moment().add('days',1);

  valid = valid && d.isBefore(d2);
  if(!valid)
    return false;  

  var d1 = getDate(_d1) || moment().subtract('years',10);
  valid = valid && d.isAfter(d1);
  return valid;
};


exports.getDate = getDate;

}());
