//@+leo-ver=4-thin
//@+node:costa.20140301123028.3255:@shadow calendario_mock_usage.js
//@<< controlla utilizzo di calendar >>
//@+node:costa.20140301123028.3253:<< controlla utilizzo di calendar >>
describe('utilizzo di calendar', function() {
	
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

describe('con data invalida torna false', function() {
  
  it('la data dd-MM-yyyy deve risultare corretta', function() {
    expect(fn(moment().format('DD-MM-YYYY'))).toEqual(true);
  });

  it('la data dd/MM/yyyy non deve risultare corretta', function() {
    expect(fn(moment().format('DD/MM/YYYY'))).toEqual(false);
  });
  
  it('la data dd/MM/yy non deve risultare corretta', function() {
    expect(fn(moment().format('DD/MM/YY'))).toEqual(false);

  });

  it('la data dd-MM-yy non deve risultare corretta', function() {
    expect(fn(moment().format('DD-MM-YY'))).toEqual(false);

  });

  it('la data yyyy/MM/dd non deve risultare corretta', function() {
    expect(fn(moment().format('YYYY/MM/DD'))).toEqual(false);

  });

  it('la data yyyy-MM-dd non deve risultare corretta', function() {
    expect(fn(moment().format('YYYY-MM-DD'))).toEqual(false);

  });

  it('la data yy-MM-dd non deve risultare corretta', function() {
    expect(fn(moment().format('YY-MM-DD'))).toEqual(false);

  });

  it('la data yy-MM-dd non deve risultare corretta', function() {
    expect(fn(moment().format('YY/MM/DD'))).toEqual(false);

  });

});
//@nonl
//@-node:costa.20140301123028.3254:<< controllo formattazione della data >>
//@nl
//@nonl
//@-node:costa.20140301123028.3255:@shadow calendario_mock_usage.js
//@-leo
