(function() {
  'use strict';

  describe('ui-bootstrap.', function() {
    beforeEach(module('app'));
    var ui_bootstrap = module('ui.bootstrap');

    describe('ui.bootstrap.tooltip', function() {
      it('ui.bootstrap.tooltip deve essere presente', function() {
        expect(ui_bootstrap.tooltip).not.toBe(null);
      });
    });


    describe('ui.bootstrap.datepicker', function() {
      it('ui.bootstrap.datepicker deve essere presente', function() {
        expect(ui_bootstrap.datepicker).not.toBe(null);
      });
    });


    describe('ui.bootstrap.modal', function() {
      it('ui.bootstrap.modal deve essere presente', function() {
        expect(ui_bootstrap.modal).not.toBe(null);
      });
    });

  });
}());