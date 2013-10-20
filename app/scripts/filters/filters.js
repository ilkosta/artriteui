// Generated by CoffeeScript 1.6.3
(function() {
  'use strict';
  /* Filters*/

  angular.module('app.filters', []).filter('interpolate', [
    'version', function(version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, version);
      };
    }
  ]);

}).call(this);