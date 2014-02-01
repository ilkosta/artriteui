var TerapiaEditCtrl = [
  '$scope', '$routeParams',
  '$timeout', 'calendar', '$http', 'loadDataListIntoScope',
  '$window', '$log', 'growl',
  function($scope, $routeParams,
    $timeout, calendar, $http, loadDataListIntoScope,
    $window, $log, growl) {

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
          }
        })
        .error(function(data, status, headers, config) {
          $log.error('lettura di Terapia Paziente non riuscita!');
          growl.addErrorMessage("lettura di Terapia Paziente non riuscita! IdPaziente :" + $routeParams.idPaziente + ' \nControlla che il server sia attivo!');
        });
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
      var form_data = $scope.tc_aggiungi;
      _.forOwn(form_data, function(v,k,o) {
        o[k] = null;
      });
    };

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
      $scope.tc_aggiungi = {};
    }



    // ----------------------------------------------------------------------
    // interazioni della form ...
    // ----------------------------------------------------------------------
    $scope.formState = {};
    $scope.Save = function() {
      $scope.formState.saving = true;
      // fai controlli di validità
      if (!$scope.terapia.data_inizio) {
        $log.error('data terapia obbligatoria');
        growl.addErrorMessage('Data terapia obbligatoria');
        $scope.formState.saving = false;
        return false;
      }

      if (!$scope.terapia.id_paziente) {
        $scope.terapia.id_paziente = $routeParams.idPaziente;
      }
      if ($scope.terapia.idterapia > 0) {
        $http.put('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco', $scope.terapia)
          .success(function(data, status, headers, config) {
            $log.info('Aggiornamento avvenuto con successo');
            growl.addSuccessMessage("Aggiornamento avvenuto con successo");
            salvaTerapiaConcomitante($scope.terapia.idterapia);
          })
          .error(function(data, status, headers, config) {
            $log.error('Aggiornamento non riuscito per la terapia del paziente :' + $scope.terapia.id_paziente);
            growl.addErrorMessage('Aggiornamento non riuscito per la terapia del paziente :' + $scope.terapia.id_paziente);
            init();
          });
      } else {
        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapia_farmaco', $scope.terapia)
          .success(function(data, status, headers, config) {
            $log.info('salvataggio avvenuto con successo');
            growl.addSuccessMessage("Aggiornamento TERAPIA FARMACOLOGICA avvenuta con successo");
            salvaTerapiaConcomitante(data.insertId);
          })
          .error(function(data, status, headers, config) {
            $log.error('salvataggio non riuscito: ');
            growl.addErrorMessage('Aggiornamento non riuscito per la terapia farmaco del paziente :' + $scope.terapia.id_paziente);
            init();
          });
      }
      // allinea gli ultimi valori prima del salvataggio
    };

    var salvaTerapiaConcomitante = function(idTerapia) {
      var terapie_concomitanti = _.map($scope.terapie_concomitanti, function(it) {
        it.id_terapia = idTerapia;
        return it;
      });

      if (terapie_concomitanti.length > 0)
        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/terapie_concomitanti', terapie_concomitanti)
          .success(function(data, status, headers, config) {
            $log.info('salvataggio avvenuto con successo');
            init();
          })
          .error(function(data, status, headers, config) {
            $log.error('salvataggio non riuscito: ');
            $log.error(data);
            $log.error(status);
            growl.addErrorMessage('salvataggio della terapia concomitante non riuscito');
            init();
          });
    }


    $scope.Cancel = function() {
      $scope.terapie_concomitanti = Restangular.copy($scope.master_tc);
      $scope.terapie_concomitanti.unchanged = tc_unchanged;
    };


    $scope.aggiungi_tc = function() {
      // requisiti da controllare....
      // allineaento dei campi mancanti
      var form_data = $scope.tc_aggiungi;
      form_data.id_terapia = $scope.terapia.idterapia;
      form_data.id_paziente = $scope.terapia.id_paziente;

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
      $window._.remove($scope.terapie_concomitanti, function(tc) {
        return tc.id_tipo_farmaco === t.id_tipo_farmaco;
      });
    };

    init();
  }
];