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
describe('con data formattata male deve tornare false', function() {
});
