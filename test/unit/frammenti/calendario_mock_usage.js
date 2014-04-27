describe('utilizzo di calendar', function() {
	
	it("deve chiamare calendar().init all'avvio", function() {
		expect(calObj.init).toHaveBeenCalled();
	});

	it('calendar().init deve essere chiamata passandogli lo scope', function() {
		expect(calObj.init).toHaveBeenCalledWith($scope);
	});
});

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
