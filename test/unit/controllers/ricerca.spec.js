;(function () {
	'use strict';

	describe('Ctrl Ricerca', function() {
		it('è caricato dal modulo app.controllers e si chiama PazientiElencoCtrl', function() {
			angular.module("app");
			var m = angular.module("app.controllers");
			// expect(PazientiElencoCtrl).not.toBe(null);
		});
	});
}());