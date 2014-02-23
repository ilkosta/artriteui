(function() {
  'use strict';

  describe("Midway: Testing Modules", function() {
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
    });
  });
}());