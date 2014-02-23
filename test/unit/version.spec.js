;(function () {
  'use strict';

  describe("verifica della versione", function() {
    beforeEach(module('app.filters'));
    beforeEach(module('app.services'));

    it("deve tornare la versione", inject(function($filter) {
      expect($filter('interpolate')(10.1)).toBe("10.1");
    }));
  });

}());