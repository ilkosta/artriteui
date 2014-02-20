// (function() {
//   "use strict";

//   describe("navbar" ,function() {

//     beforeEach(function() {
//       return browser().navigateTo("/index.html");
//     });

//     it("ti deve redirigere a /pazienti quando la 'location fragment' è vuota", function() {
//       return expect(browser().location().url()).toBe("/pazienti");
//     });


//     it("cliccando su 'pazienti' ti deve mandare ai pazienti", function() {
//       element("ul.nav a[href=\"#/pazienti\"]").click();
//       return expect(browser().location().url()).toBe("/pazienti");
//     });

//     it("cliccando su 'studio tocilizumab' ti deve mandare ai pazienti", function() {
//       element(".navbar-headeer a[href=\"#/pazienti\"]").click();
//       return expect(browser().location().url()).toBe("/pazienti");
//     });
//   });


// }).call(this);
