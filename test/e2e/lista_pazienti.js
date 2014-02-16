(function () {



    describe('ricerca', function() {

      beforeEach(function() {
        browser.get('http://localhost:3000/index.html');
      });


      it('deve essere presente il campo ricerca', function() {
        expect(element.all(by.model('query')).count()).toEqual(1);        
      });

      it('deve essere presente una lista di pazienti', function() {
        var nr_pazienti = element.all(by.repeater('paziente in pazienti')).count();
        expect(nr_pazienti).toBeGreaterThan(0);

        var nr_date_nascita = element.all(by.binding('eta')).count();
        expect(nr_date_nascita).toBeGreaterThan(0);        
        expect(nr_date_nascita).toEqual(nr_pazienti);
      });


    });


}());