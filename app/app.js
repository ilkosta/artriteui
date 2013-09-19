'use strict';

// global config
moment.lang('it');

var utils = angular.module('utils', []);

var App = angular.module('app', 
  [ 'ngLocale',
    'ngResource',
//    'app.controllers', 
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

var momentFilters = angular.module('momentFilters',[]);

momentFilters.filter('fromNow', function() {
  return function(dateString) {
    return moment(new Date(dateString)).fromNow()
  };
});
// moment filter factory
function getMomentDiffBy(param) {
  return function() {
    return function(dateString) {
      var a = moment();
      var b = moment(dateString);
      return a.diff(b, param);
    };
  };
};



// yearsFromNow, monthsFromNow, daysFromNow
_([
  {filter_name:'yearsFromNow', param: 'year'}
, {filter_name:'monthsFromNow', param: 'month'}
, {filter_name:'daysFromNow', param: 'day'}
]).each( function(filter_params) {
  momentFilters.filter( filter_params.filter_name, getMomentDiffBy(filter_params.param) );
});
