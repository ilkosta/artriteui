(function() {

'use strict';




var App = angular.module('app', 
  [ 'ngSanitize',
    'ngLocale',
    'ngResource',
    'ngRoute',
    'app.controllers', 
//    'app.directives', 
    'app.filters', 
    'app.services', 
// ----- external ------

    'ui.bootstrap',
    'angular-growl',
//    'ui.event',

// ----- custom -------
    'utils',
    'utils_forms',
    'utils_bootstrap',
    'app.templates'
// custom filters
  , 'momentFilters'
  ]);


angular.module('utils_forms',[]);
var utils = angular.module('utils', []);

App.config([
 '$routeProvider', '$locationProvider', 'growlProvider', 'datepickerPopupConfig',
 function($routeProvider, $locationProvider, growlProvider, datepickerPopupConfig, config) {

  // '$routeProvider', '$locationProvider', 'datepickerPopupConfig',
  // function($routeProvider, $locationProvider, datepickerPopupConfig, config) {


    growlProvider.globalTimeToLive(10000);
    
    datepickerPopupConfig.dateFormat = 'dd-MM-yyyy';
    datepickerPopupConfig.currentText = 'Oggi';
    datepickerPopupConfig.toggleWeeksText = 'Sett.';
    datepickerPopupConfig.clearText = 'Pulisci';
    datepickerPopupConfig.closeText = 'Chiudi';
    datepickerPopupConfig.closeOnDateSelection = true;
    datepickerPopupConfig.appendToBody = false;
    datepickerPopupConfig.showButtonBar = true;

    $routeProvider.when('/pazienti', {
      templateUrl: 'app/partials/pazienti.jade'
    })

    .when('/nuovopaziente', {
      templateUrl: 'app/partials/nuovopaziente.jade'
    })
    
    .when('/pazienti/:idPaziente/paziente_modifica', {
      templateUrl: 'app/partials/paziente_modifica.jade'      
    })

    .when('/utenti', {
      templateUrl: 'app/partials/utenti.jade'
    })

    .when('/pazienti/:idPaziente/diagnosi', {
      templateUrl: 'app/partials/diagnosi.jade'      
    })

    .when('/pazienti/:idPaziente/terapia', {
      templateUrl: 'app/partials/terapia_form.jade'      
    })

    .when('/pazienti/:idPaziente/terapia_val', {
      templateUrl: 'app/partials/terapia_valutazione_form.jade'  
    })

    .when('/pazienti/:idPaziente/anamnesi', {
      templateUrl: 'app/partials/anamnesi.jade'  
    })

    .when('/pazienti/:idPaziente/fattori_rischio', {
      templateUrl: 'app/partials/fattori_rischio.jade'   
    })

    .when('/pazienti/:idPaziente/sospensioni', {
      templateUrl: 'app/partials/sospensioni.jade'   
    })

    .when('/pazienti/:idPaziente/terapie_pre', {
      templateUrl: 'app/partials/terapie_pre.jade'   
    })

    .when('/pazienti/:idPaziente/esami_laboratorio', {
      templateUrl: 'app/partials/esami_laboratorio.jade'   
    })



    .when('/no_connessione', {
      templateUrl: 'app/partials/no_connessione.jade'      
    })

    .when('/no_db', {
      templateUrl: 'app/partials/no_connessione_DB.jade'      
    })

    .otherwise({
      redirectTo: '/pazienti'
    });
    //$locationProvider.jade5Mode(false);
  }
]);

// global config
moment.lang('it');


})();