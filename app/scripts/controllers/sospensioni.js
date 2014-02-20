(function() {
  'use strict';

  var mod = angular.module('app.controllers');

  mod.controller('SospensioniCtrl', ['$scope', '$routeParams', '$http', 'calendar', 'loadDataListIntoScope',
    function($scope, $routeParams, $http, calendar, loadDataListIntoScope) {

      calendar().init($scope);

      var EForm = (function() {

        function EForm() {
          // enforces new
          if (!(this instanceof EForm)) {
            return new EForm();
          }

          this.init();
        }

        EForm.prototype.init = function() {
          _.forOwn(this, function(v, k, o) {
            o[k] = null;
          });
          this.cod_tipo_sospensione = "t";
          this.data_sospensione = new Date();
          this.data_fine_sospensione = null;

        };

        EForm.prototype.edit = function(sosp) {
          this.idterapia_sospensione = sosp.idterapia_sospensione;
          this.cod_tipo_sospensione = sosp.cod_tipo_sospensione;
          this.id_motivo_sospensione = sosp.id_sospensione;
          this.id_sospensione_dettaglio = sosp.id_sospensione_dettaglio;
          this.data_sospensione = sosp.data_inizio;
          this.data_fine_sospensione = sosp.data_fine;
          this.annotazioni = sosp.note;
          this.num_infusioni_fatte = sosp.num_infusioni_fatte || 0;
          this.follow_up = sosp.follow_up || 0;
        };

        return EForm;

      }());

      // ------------------------------------------
      //    init
      // ------------------------------------------
      var init = function() {
        $scope.eForm = new EForm();

        loadParameters();
        loadData();

      };

      var loadParameters = function() {
        loadDataListIntoScope($scope, [
          'cod_tipo_sospensione'
        ], function(p) {
          return '/data/_' + p;
        });

        $http.get('/data/_tipo_sospensione')
          .success(function(data, status, headers, config) {
            $scope.tipo_sospensione = data;
            $scope.tipoSospensioneById = _.groupBy(data, 'idtipo_motivo_sospensione');
            $scope.motiviSospensione = _($scope.tipoSospensioneById)
              .keys().map(function(k) {
                return {
                  id: +k, // cast to int
                  desc: $scope.tipoSospensioneById[k][0].sospensione
                };
              }).value();

          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura delle sospensioni del paziente.\nControlla la connessione al server!");
            $scope.tipo_sospensione = {};
          });

      };

      var loadData = function() {
        $scope.sospensioni = null;
        $http.get('/data/pazienti/' + $routeParams.idPaziente + '/sospensioni')
          .success(function(data, status, headers, config) {
            $scope.sospensioni = data;
          })
          .error(function(data, status, headers, config) {});
      };



      // -----------------------------------------
      // eventi della lista
      // -----------------------------------------
      $scope.editSospensione = function(sosp) {
        sosp.class = "warning";
        $scope.eForm.edit(sosp);
        $scope.eForm.visible = true;
      };


      // -----------------------------------------
      // eventi della form
      // -----------------------------------------
      $scope.aggiungiSospensione = function() {
        var getSospensioneFromForm = function() {

          var sosp = {
            idterapia_sospensione: $scope.eForm.idterapia_sospensione,
            tipo_sospensione: $scope.eForm.cod_tipo_sospensione,
            id_sospensione: $scope.eForm.id_motivo_sospensione,
            id_sospensione_dettaglio: $scope.eForm.id_sospensione_dettaglio,
            data_inizio: $scope.eForm.data_sospensione,
            data_fine: $scope.eForm.data_fine_sospensione,
            note: $scope.eForm.annotazioni,
            num_infusioni_fatte: $scope.eForm.num_infusioni_fatte || 0,
            follow_up: $scope.eForm.follow_up || 0,
            sospensione: $scope.tipoSospensioneById[$scope.eForm.id_motivo_sospensione][0].sospensione

          };

          // allineo la desc. della sospensione (non serve ed è pure costoso :) ... per trasparenza
          if ($scope.eForm.id_sospensione_dettaglio &&
            $scope.tipoSospensioneById[$scope.eForm.id_motivo_sospensione].length > 0) {
            sosp.dettaglio = _.find($scope.tipoSospensioneById[$scope.eForm.id_motivo_sospensione],
              function(s) {
                return s.id_sospensione_dettaglio == $scope.eForm.id_sospensione_dettaglio;
              }).sospensione_dettaglio;
          }


          return sosp;
        };

        var url = "/data/pazienti/" + $routeParams.idPaziente + '/sospensioni/';
        if ($scope.eForm.idterapia_sospensione) {
          // aggiorna la sospensione

          url += $scope.eForm.idterapia_sospensione;
          url += "/aggiorna";

          $http.post(url, getSospensioneFromForm())
            .success(function(data, status, headers, config) {
              init();
            })
            .error(function(data, status, headers, config) {
              var msg = "Salvataggio della sospensione fallito!";
              msg += "codice: " + status;
              growl.addErrorMessage(msg);
            });
        } else {
          // inserisce la sospensione
          if (!$scope.eForm.data_sospensione || !$scope.eForm.id_motivo_sospensione)
            return;

          url += 'inserisci';
          $http.post(url, getSospensioneFromForm())
            .success(function(data, status, headers, config) {
              //growl.addSuccessMessage("Sospensione salvata con successo");
              init();
            })
            .error(function(data, status, headers, config) {
              var msg = "Salvataggio della sospensione fallito!";
              msg += "codice: " + status;
              growl.addErrorMessage(msg);
            });
        }
      };


      var getDataFromSospensioni = function(what, params) {
        return $http.get("/data/pazienti/" + $routeParams.idPaziente + "/sospensioni/" + what, {
          params: params
        });
      };

      $scope.calculateNumInfusioni = function() {

        var dt = $scope.eForm.data_sospensione || new Date();
        var res = getDataFromSospensioni('tempo', {
          datasospensione: dt
        });

        if (res.satus != 200)
          growl.addErrorMessage("Errore nella lettura del numero delle infusioni del paziente.\nControlla la connessione al server!");
        else
        if (res.data.length > 0) {
          $scope.eForm.num_infusioni_fatte = res.data[0].numero_infusioni;
          console.log("numero infusioni:");
          console.log(data[0].numero_infusioni);
        }
      }

      $scope.calculateFollowUp = function() {
        var dt = $scope.eForm.data_sospensione || new Date();
        var res = getDataFromSospensioni('tempomesi', {
          datasospensione: dt
        });

        if (res.satus != 200)
          growl.addErrorMessage("Errore nella lettura del numero delle infusioni del paziente.\nControlla la connessione al server!");

        else
        if (res.data.length > 0) {
          $scope.eForm.follow_up = res.data[0].mesi;
          console.log("numero mesi:");
          console.log(res.data[0].mesi);
        }

      }


      $scope.cancellaSospensione = function(sosp) {
        $http.post('/data/pazienti/' + $routeParams.idPaziente + '/sospensioni/' + sosp.idterapia_sospensione + '/cancella', sosp)
          .success(function(data, status, headers, config) {
            loadData();
          })
          .error(function(data, status, headers, config) {
            var msg = "cancellazione della sospensione fallita!";
            msg += "codice: " + status;
            growl.addErrorMessage(msg);
          })
      };

      init();
    }
  ]);
}());