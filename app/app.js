'use strict';

var App = angular.module('app', 
  [ 'ngLocale',
    'ngResource',
//    'app.controllers', 
    'app.directives', 
    'app.filters', 
    'app.services', 
    'restangular',
    'ui.bootstrap',
    'partials']);

App.config([
  '$routeProvider', '$locationProvider', 'RestangularProvider', 
  function($routeProvider, $locationProvider, RestangularProvider, config) {
    RestangularProvider.setBaseUrl('/data');
    
    $routeProvider.when('/pazienti', {
      templateUrl: '/partials/pazienti.html'
    }).when('/nuovopaziente', {
      templateUrl: '/partials/nuovopaziente.html'
    }).when('/utenti', {
      templateUrl: '/partials/utenti.html'
    }).when('/pazienti/:idPaziente', {
      templateUrl: '/partials/pazientedettaglio.html',
      controller: 'PazienteDettaglioCtrl'
    }).when('/pazienti/:idPaziente/Diagnosi', {
      
    }).otherwise({
      redirectTo: '/pazienti'
    });
    $locationProvider.html5Mode(false);
  }
]);
