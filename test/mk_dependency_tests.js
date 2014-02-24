(function() {
  'use strict';

  var fs = require('fs'),
    path = require('path');

  fs.readdir(path.join(__dirname, 'unit', 'dependencies'), function(err, files) {
    var testFiles = files.filter(function(f) {
      return /.+.spec.js/.test(f);
    });
    fs.writeFile(
      path.join(__dirname, 'dependency_tests.js'),
      'var dependency_tests = ["' + testFiles.join('","') + '"];',
      'utf8',
      function(err) {
        if (err) throw err;
      });
  });

}());