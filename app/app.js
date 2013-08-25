'use strict';

var App = angular.module('app', 
  [ 'ngCookies', 
    'ngResource', 
    'app.controllers', 
    'app.directives', 
    'app.filters', 
    'app.services', 
    'partials']);

App.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider, config) {
    $routeProvider.when('/pazienti', {
      templateUrl: '/partials/pazienti.html'
    }).when('/nuovopaziente', {
      templateUrl: '/partials/nuovopaziente.html'
    }).when('/utenti', {
      templateUrl: '/partials/utenti.html'
    }).when('/pazienti/:idPaziente', {
      templateUrl: '/partials/pazientedettaglio.html'
    }).otherwise({
      redirectTo: '/pazienti'
    });
    return $locationProvider.html5Mode(false);
  }
]);
