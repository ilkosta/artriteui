(function() {

'use strict';




var App = angular.module('app', 
  [ 'ngSanitize',
    'ngLocale',
    'ngResource',
    'app.controllers', 
//    'app.directives', 
//    'app.filters', 
//    'app.services', 
// ----- external ------
    'restangular',
    'ui.bootstrap',
    'angular-growl',
//    'ui.event',

// ----- custom -------
    'utils',
    'utils_forms',
    'utils_bootstrap',
    'partials'
// custom filters
  , 'momentFilters'
  ]);


angular.module('utils_forms',[]);
var utils = angular.module('utils', []);

App.config([
  '$routeProvider', '$locationProvider', 'RestangularProvider', 'growlProvider', 
  function($routeProvider, $locationProvider, RestangularProvider, growlProvider, config) {

    growlProvider.globalTimeToLive(10000);

    RestangularProvider.setBaseUrl('/data');
    RestangularProvider.setErrorInterceptor(utils.checkServer);
    
    $routeProvider.when('/pazienti', {
      templateUrl: '/partials/pazienti.html'
    }).when('/nuovopaziente', {
      templateUrl: '/partials/nuovopaziente.html'
    }).when('/utenti', {
      templateUrl: '/partials/utenti.html'
    }).when('/pazienti/:idPaziente/diagnosi', {
      templateUrl: '/partials/pazientedettaglio.html'      
    }).when('/pazienti/:idPaziente/terapia', {
      templateUrl: '/partials/pazientedettaglio.html'      
    }).when('/pazienti/:idPaziente/terapia_val', {
      templateUrl: '/partials/pazientedettaglio.html'      
    }).when('/no_connessione', {
      templateUrl: '/partials/no_connessione.html'      
    }).when('/no_db', {
      templateUrl: '/partials/no_connessione_DB.html'      
    }).otherwise({
      redirectTo: '/pazienti'
    });
    $locationProvider.html5Mode(false);
  }
]);

// global config
moment.lang('it');


})();