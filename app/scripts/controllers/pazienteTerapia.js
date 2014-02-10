(function() {
  'use strict';
  var mod = angular.module('app.controllers');
  mod.controller('TerapiaEditCtrl', [
    '$scope', '$routeParams',
    '$timeout', 'calendar', '$http', 'loadDataListIntoScope',
    '$log', 'growl', '$modal', 
    function($scope, $routeParams,
      $timeout, calendar, $http, loadDataListIntoScope,
      $log, growl, $modal) {

      calendar().init($scope);


      // constraints
      var tc_unchanged = function() {
        return angular.equals($scope.terapie_concomitanti, $scope.master_tc);
      };

      var initPazienti = function() {
        $http.get('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco')
          .success(function(data, status, headers, config) {

            $scope.terapia = {
              data_inizio: new Date()
            }; // inizializzo la data a oggi

            if (data.length > 0) {
              $scope.master = data[0];
              $scope.terapia = data[0];

              $scope.terapia.data_inizio_ori = angular.copy($scope.terapia.data_inizio);
            }


          })
          .error(function(data, status, headers, config) {
            $log.error('lettura di Terapia Paziente non riuscita!');
            growl.addErrorMessage("lettura di Terapia Paziente non riuscita! IdPaziente :" + $routeParams.idPaziente + ' \nControlla che il server sia attivo!');
          });
      }

      $scope.ripristina_data_inizio = function() {
        $scope.terapia.data_inizio = angular.copy($scope.terapia.data_inizio_ori);
      }


      var initTerapieConcomitanti = function() {
        // load terapie_concomitanti (da pazienti/:id/terapie_concomitanti)
        $http.get('data/pazienti/' + $routeParams.idPaziente + '/terapie_concomitanti')
          .success(function(data, status, headers, config) {
            $scope.terapie_concomitanti = data;
          })
          .error(function(data, status, headers, config) {
            $log.error('lettura di Terapia terapie_concomitanti non riuscita!');
            growl.addErrorMessage('Lettura di Terapia terapie_concomitanti non riuscita! \nControlla che il server sia attivo!');
          });
      };

      var initTerapieConcomitantiForm = function() {
        $scope.tc_aggiungi = {}
        $scope.formState.visible = false;
      };

      $scope.initForm = initTerapieConcomitantiForm;

      var init = function() {
        initPazienti();


        // parametri: _farmaci_dimard 
        loadDataListIntoScope(
          $scope, ['farmaci_dimard', 'tipo_sospensione_dimard'],
          function(p) {
            return '/data/_' + p;
          }
        );

        initTerapieConcomitanti();
        initTerapieConcomitantiForm();

        $scope.formState.saving = false;
        $scope.formState.visible = false;

        $scope.tc_aggiungi = {};
      }

      // ----------------------------------------------------------------------
      // interazioni della form della terpia TCZ
      // ----------------------------------------------------------------------
      $scope.openTerapiaConcomitanteCancelDlg = function(terapiaToDelete) {

        var TerapiaConcomitanteCancelDlgIstance = [
          '$scope', '$modalInstance', 'tcToDelete',
          function($scope, $modalInstance, tcToDelete) {

            $scope.tcToDelete = tcToDelete;

            $scope.ok = function() {
              var url = '/data/pazienti/' + tcToDelete.id_paziente;
              url += '/cancella/terapie_concomitanti/dmard/' + tcToDelete.idterapia_concomitante;
              $modalInstance.close($http.post(url, tcToDelete));
            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };

          }
        ];

        var modalInstance = $modal.open({
          //template: $templateCache.get('/partials/terapia_concomitante_canc_form.html'),
          templateUrl: '/partials/terapia_concomitante_canc_form.html',
          controller: TerapiaConcomitanteCancelDlgIstance,
          resolve: {
            tcToDelete: function() {
              return terapiaToDelete;
            }
          }
        });

        modalInstance.result.then(function(httpDelPromise) {
          if (httpDelPromise.status == 200) {
            $log.info('cancellazione avvenuta con successo, di');
            debugger;
            initTerapieConcomitanti();
            initTerapieConcomitantiForm();
          } else {
            $log.error('cancellazione non riuscita: ');
            $log.error(httpDelPromise);
            growl.addErrorMessage('Cancellazione non riuscita per la terapia DMARD');
            init();
          }

        }, function() {
          // do nothing  
        });
      };



      $scope.salva_inizio_terapia = function() {
        $scope.formState.saving = true;
        // fai controlli di validità
        if (!$scope.terapia.data_inizio) {
          $log.error('data terapia obbligatoria');
          growl.addErrorMessage('Data terapia obbligatoria');
          $scope.formState.saving = false;
          return false;
        }

        // fix della data -------------------
        $scope.terapia.data_inizio = moment($scope.terapia.data_inizio).format('YYYY-MM-DD');
        // ----------------------------------

        if (!$scope.terapia.id_paziente) {
          $scope.terapia.id_paziente = $routeParams.idPaziente;
        }
        if ($scope.terapia.idterapia > 0) {
          $http.put('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco', $scope.terapia)
            .success(function(data, status, headers, config) {
              $log.info('Aggiornamento avvenuto con successo');
              initPazienti();
            })
            .error(function(data, status, headers, config) {
              $log.error('Aggiornamento non riuscito per la terapia del paziente :' + $scope.terapia.id_paziente);
              $log.log({
                data: data,
                status: status,
                headers: headers,
                config: config
              });
              growl.addErrorMessage('Aggiornamento non riuscito per la terapia del paziente :' + $scope.terapia.id_paziente);
              init();
            });
        } else {
          $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco', $scope.terapia)
            .success(function(data, status, headers, config) {
              $log.info('salvataggio avvenuto con successo');
              initPazienti();
            })
            .error(function(data, status, headers, config) {
              $log.error('salvataggio non riuscito: ');
              $log.log({
                data: data,
                status: status,
                headers: headers,
                config: config
              });
              growl.addErrorMessage('Aggiornamento non riuscito per la terapia farmaco del paziente :' + $scope.terapia.id_paziente);
              init();
            });
        }
        // allinea gli ultimi valori prima del salvataggio
      };


      // ----------------------------------------------------------------------
      // interazioni della form di terpia concomitante
      // ----------------------------------------------------------------------
      $scope.formState = {};


      $scope.aggiungi_tc = function() {
        // requisiti da controllare....
        // allineaento dei campi mancanti
        var form_data = $scope.tc_aggiungi;
        form_data.id_terapia = $scope.terapia.idterapia;
        form_data.id_paziente = $scope.terapia.id_paziente;
        // aggiusto le date
        form_data.d_inizio = moment(form_data.d_inizio).format('YYYY-MM-DD');

        if (form_data.d_fine)
          form_data.d_fine = moment(form_data.d_fine).format('YYYY-MM-DD');

        // save
        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapie_concomitanti/dmard', form_data)
          .success(function(data, status, headers, config) {
            $log.info('salvataggio avvenuto con successo');
            initTerapieConcomitanti();
            initTerapieConcomitantiForm();
          })
          .error(function(data, status, headers, config) {
            $log.error('salvataggio non riuscito: ');
            growl.addErrorMessage('Aggiornamento non riuscito per la terapia DMARD');
            init();
          });
      };

      $scope.elimina_tc = function(t) {
        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/cancella/terapie_concomitanti/dmard/' + t.idterapia_concomitante, t)
          .success(function(data, status, headers, config) {
            $log.info('cancellazione avvenuta con successo, di');
            $log.info(t);
            initTerapieConcomitanti();
            initTerapieConcomitantiForm();
          })
          .error(function(data, status, headers, config) {
            $log.error('cancellazione non riuscita: ');
            $log.error({
              data: data,
              status: status,
              headers: headers,
              config: config
            });
            growl.addErrorMessage('Cancellazione non riuscita per la terapia DMARD');
            init();
          });
      };

      $scope.modifica_tc = function(t) {
        $scope.tc_aggiungi = angular.copy(t);
        $scope.formState.visible = true;
      }


      init();
    }


  ]);

}());