//@+leo-ver=4-thin
//@+node:costa.20140301123028.3249:@shadow calendario_mock.js
//@<< Calendar class >>
//@+node:costa.20140301123028.3250:<< Calendar class >>
var Calendar = (function() {

	function Calendar() {
		// enforces new
		if (!(this instanceof Calendar)) {
			return new Calendar();
		}
		// constructor body
	}

	Calendar.prototype.init = function() {};

	return Calendar;

}());
//@nonl
//@-node:costa.20140301123028.3250:<< Calendar class >>
//@nl

var getCalMock = function() {
	var calMock = new Calendar();
	
	spyOn(calMock, 'init');
	
	return calMock;
};
//@nonl
//@-node:costa.20140301123028.3249:@shadow calendario_mock.js
//@-leo
