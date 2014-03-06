(function() {
  'use strict';
  var test_theme = "Testing Modules";
  describe(test_theme, function() {
    describe("App Module:", function() {

      it("app deve essere registrata", function() {
        var module = angular.module("app");
        //dump(module);
        expect(module).not.toBeNull();
      });
      it('deve avere alcune dipendenze fondamentali', function() {
        var module = angular.module("app");
        expect(module.requires).toContain('app.controllers');
        expect(module.requires).toContain('utils');
        expect(module.requires).toContain('app.templates');
        expect(module.requires).toContain('momentFilters');
        expect(module.requires).toContain('ui.bootstrap');
      });

      test_theme = 'Rendere indolore l\'aggiornamento delle dipendenze.';
      describe(test_theme, function() {
        test_theme = 'Ogni dipendenza deve avere un proprio test unitario.';
        test_theme += ' che verifica la presenza delle funzionalità usate dall\'app';
        test_theme += ' in modo da controllare che non sia cambiata l\'API da cui dipende il programma.';


        it(test_theme, function() {
          var module = angular.module("app");

          // verifico la presenza in dependency_tests che è stata inserita dallo script dependency_tests.js 
          // creato da after-brunch
          _(module.requires)
            .filter(function(mn) { return /^[^n][^g].+/.test(mn); })
            .each(function(mn) {
              expect(dependency_tests).toContain(mn + '.spec.js');
          });

        });


      });


    });
  });
}());