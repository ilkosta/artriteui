// An example configuration file.

var path = require('path');

var spath = path.join(__dirname, '../node_modules/protractor/selenium/selenium-server-standalone-2.39.0.jar');
console.log(spath);


exports.config = {
  // The address of a running selenium server.
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: spath,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['e2e/*.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
