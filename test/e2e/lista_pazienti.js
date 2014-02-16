(function() {



  var PaginaRicerca = function() {
    this.nameInput = element(by.model('yourName'));
    this.greeting = element(by.binding('yourName'));

    this.get = function() {
      browser.get('http://localhost:3000/index.html#/pazienti');
    };

    this.getPazienti = function() {
      return element(by.repeater('paziente in pazienti'));
    };

    this.getNrPazienti = function() {
      return element.all(by.repeater('paziente in pazienti')).count();
    }; 

    this.setQuery = function(what) {
      element(by.model('query')).sendKeys(what);
    };
  };

  describe('pagina di ricerca', function() {
    var paginaRicerca = null;

    beforeEach(function() {
      paginaRicerca = new PaginaRicerca();
      paginaRicerca.get();
    });


    it('deve essere presente il campo ricerca', function() {
      expect(element.all(by.model('query')).count()).toEqual(1);
    });

    it('deve essere presente una lista di pazienti', function() {
      expect(paginaRicerca.getNrPazienti()).toBeGreaterThan(0);
    });

    it('tutti i pazienti nella lista devono avere una data di nascita', function() {
      var nr_pazienti = element.all(by.repeater('paziente in pazienti')).count();

      var nr_date_nascita = element.all(by.binding('eta')).count();
      expect(nr_date_nascita).toEqual(paginaRicerca.getNrPazienti());
    });

    describe('query di ricerca', function() {
      it('visto che la sperimentazione è iniziata nel 2013, ci saranno sicuramente dei pazienti con data di infuzione nel 2013', function() {

        var nr_pazienti_iniziale = paginaRicerca.getNrPazienti();
        expect(nr_pazienti_iniziale).toBeGreaterThan(0);

        paginaRicerca.setQuery('2013'); // iserisco 2013 nel campo di ricerca

        var nr_pazienti_dopo = paginaRicerca.getNrPazienti();
        expect(nr_pazienti_iniziale).toBeGreaterThan(nr_pazienti_dopo);
      });

      it('inserendo una query assurda, non devono essere estratti risultati', function() {
        paginaRicerca = new PaginaRicerca();
        paginaRicerca.get();
        paginaRicerca.setQuery('aaaaaValoreCheNonEsisteaaaa');

        expect(paginaRicerca.getPazienti().isPresent()).toEqual(false);
      });
    });

  });


}());