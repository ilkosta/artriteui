(function() {

'use strict';




var App = angular.module('app', 
  [ 'ngSanitize',
    'ngLocale',
    'ngResource',
    'ngRoute',
    'app.controllers', 
//    'app.directives', 
//    'app.filters', 
//    'app.services', 
// ----- external ------

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
//  '$routeProvider', '$locationProvider', 'growlProvider', 'datepickerPopupConfig',
//  function($routeProvider, $locationProvider, growlProvider, datepickerPopupConfig, config) {

  '$routeProvider', '$locationProvider', 'datepickerPopupConfig',
  function($routeProvider, $locationProvider, datepickerPopupConfig, config) {


    //growlProvider.globalTimeToLive(10000);
    
    datepickerPopupConfig.dateFormat = 'dd-MM-yyyy';
    datepickerPopupConfig.currentText = 'Oggi';
    datepickerPopupConfig.toggleWeeksText = 'Sett.';
    datepickerPopupConfig.clearText = 'Pulisci';
    datepickerPopupConfig.closeText = 'Chiudi';
    datepickerPopupConfig.closeOnDateSelection = true;
    datepickerPopupConfig.appendToBody = false;
    datepickerPopupConfig.showButtonBar = true;

    $routeProvider.when('/pazienti', {
      templateUrl: '/partials/pazienti.html'
    })

    .when('/nuovopaziente', {
      templateUrl: '/partials/nuovopaziente.html'
    })
    
    .when('/pazienti/:idPaziente/paziente_modifica', {
      templateUrl: '/partials/paziente_modifica.html'      
    })

    .when('/utenti', {
      templateUrl: '/partials/utenti.html'
    })

    .when('/pazienti/:idPaziente/diagnosi', {
      templateUrl: '/partials/diagnosi.html'      
    })

    .when('/pazienti/:idPaziente/terapia', {
      templateUrl: '/partials/terapia_form.html'      
    })

    .when('/pazienti/:idPaziente/terapia_val', {
      templateUrl: '/partials/terapia_valutazione_form.html'  
    })

    .when('/pazienti/:idPaziente/anamnesi', {
      templateUrl: '/partials/anamnesi.html'  
    })

    .when('/pazienti/:idPaziente/fattori_rischio', {
      templateUrl: '/partials/fattori_rischio.html'   
    })

    .when('/pazienti/:idPaziente/sospensioni', {
      templateUrl: '/partials/sospensioni.html'   
    })

    .when('/pazienti/:idPaziente/terapie_pre', {
      templateUrl: '/partials/terapie_pre.html'   
    })

    .when('/pazienti/:idPaziente/esami_laboratorio', {
      templateUrl: '/partials/esami_laboratorio.html'   
    })



    .when('/no_connessione', {
      templateUrl: '/partials/no_connessione.html'      
    })

    .when('/no_db', {
      templateUrl: '/partials/no_connessione_DB.html'      
    })

    .otherwise({
      redirectTo: '/pazienti'
    });
    //$locationProvider.html5Mode(false);
  }
]);

// global config
moment.lang('it');


})();