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
