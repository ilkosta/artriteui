'use strict';

// global config
moment.lang('it');

var utils = angular.module('utils', []);

var App = angular.module('app', 
  [ 'ngLocale',
    'ngResource',
    'app.controllers', 
//    'app.directives', 
//    'app.filters', 
//    'app.services', 
    'restangular',
    'ui.bootstrap',
    'ui.event',
    'utils',
    'utils_forms',
    'utils_bootstrap',
    'partials'
// custom filters
  , 'momentFilters'
  ]);

App.config([
  '$routeProvider', '$locationProvider', 'RestangularProvider',
  function($routeProvider, $locationProvider, RestangularProvider, config) {
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


angular.module('utils_forms',[]);