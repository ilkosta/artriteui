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
//@<< controlla utilizzo di calendar >>
//@+node:costa.20140301123028.3253:<< controlla utilizzo di calendar >>
describe('utilizzo di calendar', function() {
	beforeEach(function() {
		//calObj = new Calendar();
		//spyOn(calObj, 'init');
	});
	
	it("deve chiamare calendar().init all'avvio", function() {
		expect(calObj.init).toHaveBeenCalled();
	});

	it('calendar().init deve essere chiamata passandogli lo scope', function() {
		expect(calObj.init).toHaveBeenCalledWith($scope);
	});
});
//@nonl
//@-node:costa.20140301123028.3253:<< controlla utilizzo di calendar >>
//@nl
//@<< controllo formattazione della data >>
//@+node:costa.20140301123028.3254:<< controllo formattazione della data >>
describe('con data formattata male deve tornare false', function() {
});
//@nonl
//@-node:costa.20140301123028.3254:<< controllo formattazione della data >>
//@nl
//@nonl
//@-node:costa.20140301123028.3249:@shadow calendario_mock.js
//@-leo
