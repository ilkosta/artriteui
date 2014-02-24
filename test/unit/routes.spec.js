
(function() {
  'use strict';

  // When testing routes we want to ensure that the routes we're focussed on are routed properly in our application. Therefore we will need to check where the route is routed to and if the route itself is redirected or not found. A 404 page should be displayed and a $routeChangeError event should be fired if a route is not found. We should also check to see if the template is loaded for the route within the view. The best types of tests for this are Midway tests and E2E tests. 
  describe('routing', function() {
    var tester;
    beforeEach(function() {
      tester = ngMidwayTester('app');
    });

    afterEach(function() {
      tester.destroy();
      tester = null;
    });



    it("pazienti", function() {
      var visited = false;
      runs(function(){
        tester.visit('/pazienti', function() { visited = true; });
      },1000);

      waitsFor(function() {return visited;}, 'la pagina corrente dovrebbe essere pazienti', 2000);

      runs(function() {
        expect(tester.path()).toEqual('/pazienti');
        expect(tester.viewElement().html()).toContain('Elenco dei pazienti');
        //var scope = tester.viewScope();
      });
      
    });


    it("nuovo paziente", function() {
      var visited = false;
      runs(function(){
        tester.visit('/nuovopaziente', function() { visited = true; });
      },1000);

      waitsFor(function() {return visited;}, 'la pagina corrente dovrebbe essere /nuovopaziente', 2000);

      runs(function() {
        expect(tester.path()).toEqual('/nuovopaziente');
        expect(tester.viewElement().html()).toContain('Inserimento nuovo paziente');
        expect(tester.viewElement().html()).toContain('Codice Fiscale');
        //var scope = tester.viewScope();
      });
      
    });


  });

}());