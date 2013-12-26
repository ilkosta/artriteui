;(function () {
  'use strict';

exports.isDateInRange = function(_d, _d1, _d2) {
  if(!_d)
    return false;
  var d = moment(_d);
  var valid = d.isValid();
  if(!valid)
    return false;
var
   d2 = _d2 || moment().add('days',1);
  valid = valid && d.isBefore(d2);
  if(!valid)
    return false;  

  var d1 = _d1 || moment().subtract('years',10)
  valid = valid && d.isAfter(d1);
  return valid;
};


}());
