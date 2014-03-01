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

var getCalMock = function() {
	var calMock = new Calendar();
	
	spyOn(calMock, 'init');
	
	return calMock;
};
