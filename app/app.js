'use strict';

var utils = angular.module('utils', []);

var App = angular.module('app', 
  [ 'ngLocale',
    'ngResource',
//    'app.controllers', 
    'app.directives', 
    'app.filters', 
    'app.services', 
    'restangular',
    'ui.bootstrap',
    'utils',
    'utils_forms',
    'utils_bootstrap',
    'partials']);

/*
var checkDB = ['$http', '$location', 
  function($http,$location) {
    return function() {
      $http({method:'GET', url: '/data/pazienti'})
        .success( function(data, status, headers, config) {
          // all seems ok...
          return true;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.        
          console.log('errore invocando: GET ' + '/data/pazienti');
          _([data, status, headers, config]).each(console.log);
          
          $location.url = '/no_connessione_DB';
          return false;
        });
    }
  }];
  
var checkServer = ['$http', '$location', function($http, $location) {
    return function() {
      $http({method:'GET', url: '/data/ping.json'})
        .success( function(data, status, headers, config) {
          if(data.length === 1 && data[0].it_work)
            return checkDB();
          else 
            $location.url = '/no_connessione';
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.        
          console.log('errore invocando: GET ' + '/data/ping.json');
          _([data, status, headers, config]).each(console.log);
          
          $location.url = '/no_connessione';
          return false;
        });
    }
  }];
*/

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
    }).when('/pazienti/:idPaziente', {
      templateUrl: '/partials/pazientedettaglio.html',
      controller: 'PazienteDettaglioCtrl'
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
