(function (){
  var mod = angular.module('app.controllers');

  mod.controller('SospensioniCtrl', [
    '$scope', '$routeParams',
    '$http', 'calendar' , 'growl', 
    'loadDataListIntoScope',
    function(
        $scope,$routeParams,
        $http, calendar, growl,
        loadDataListIntoScope) {

      // ---- editForm ------
      function editForm() {
        this.init();
      }

      editForm.prototype.init = function() {
        this.idterapia_sospensione = null;
        this.cod_tipo_sospensione = "t";
        this.id_motivo_sospensione = null;
        this.id_sospensione_dettaglio = null;
        this.data_sospensione = null;
        this.data_fine_sospensione = null;
        this.annotazioni = null;

        this.visible = false;
      };

      editForm.prototype.edit = function(sosp) {
        this.idterapia_sospensione = sosp.idterapia_sospensione;
        this.cod_tipo_sospensione = sosp.cod_tipo_sospensione;
        this.id_motivo_sospensione = sosp.id_sospensione;
        this.id_sospensione_dettaglio = sosp.id_sospensione_dettaglio;
        this.data_sospensione = sosp.data_inizio;
        this.data_fine_sospensione = sosp.data_fine;
        this.annotazioni = sosp.note;
      };


      editForm.prototype.setMotivoSospensione = function(v) { this.id_motivo_sospensione = v; };
      editForm.prototype.setMotivoSospensione2 = function(v) { this.id_sospensione_dettaglio = v; };

      var dataUrl = {};
      $scope.eForm = new editForm();

      

      //----- sospensioniMngr -----
      function sospensioniMngr(data) {
        var grouped = _.groupBy(data,'idtipo_motivo_sospensione');
        console.log("sospensioniMngr:grouped");
        console.log(grouped);

        var res = function() {
          this.edit = $scope.eForm;
          this.motiviSospensioneDett = [];
          this.motiviSospensione = _(grouped).keys().map(function(k) {
            return {id: k, desc: grouped[k][0].sospensione };
          }).value(); 
        };

        

        res.prototype.reloadMotiviSospensioneDett = function() { 
          if(!this.edit.id_motivo_sospensione) {
            this.motiviSospensioneDett = [];
            return;
          }
          var ret = _(grouped[this.edit.id_motivo_sospensione])
            .filter(function(i){ return i.id_sospensione_dettaglio !== null; })
            .map(function(i) { return {id: i.id_sospensione_dettaglio, desc: i.sospensione_dettaglio}; })
            .value();
          this.motiviSospensioneDett =  ret;
        };

        res.prototype.getSospensione = function() {
          var sosp = {};
          sosp.idterapia_sospensione    = this.edit.idterapia_sospensione;
          sosp.tipo_sospensione         = this.edit.cod_tipo_sospensione;
          sosp.id_sospensione           = this.edit.id_motivo_sospensione;
          sosp.id_sospensione_dettaglio = this.edit.id_sospensione_dettaglio;
          sosp.data_inizio              = this.edit.data_sospensione;
          sosp.data_fine                = this.edit.data_fine_sospensione;
          sosp.note                     = this.edit.annotazioni;          

          var dett_sospensioni = grouped[this.edit.id_motivo_sospensione];
          sosp.sospensione = dett_sospensioni[0].sospensione;
          var self = this;
          sosp.dettaglio = (this.edit.id_sospensione_dettaglio && dett_sospensioni.length >0 ) 
            ? _.find( dett_sospensioni, function(s) {
                return s.id_sospensione_dettaglio == self.edit.id_sospensione_dettaglio;
              }).sospensione_dettaglio 
            : null;


          return sosp;

        };

        return res;
      }

      $scope.editSospensione = function(idterapia_sospensione) {
        var sosp = _.find($scope.sospensioni, function(s) {
          return s.idterapia_sospensione == idterapia_sospensione;
        });
        if(sosp) {
          sosp.class = "warning";
          $scope.eForm.edit(sosp);
          $scope.eForm.visible = true;
          $scope.tipo_sospensione.reloadMotiviSospensioneDett();
        }
      };
      
      var loadData = function() {
        dataUrl = {
          sospensioni: '/data/pazienti/' + $routeParams.idPaziente + '/sospensioni'
        };

        // init di $scope.sospensioni
        $http.get(dataUrl.sospensioni)
          .success(function(data, status, headers, config) {
            $scope.sospensioni = data || [];
            console.log("sospensioni:");
            console.log($scope.sospensioni);
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura delle sospensioni del paziente.\nControlla la connessione al server!");
            $scope.sospensioni = [];
          });
      };

      var loadParameters = function() {
        loadDataListIntoScope(
          $scope,
          [ 'cod_tipo_sospensione'],
          function(p) { return '/data/_' + p;}
        ); 

        $http.get('/data/_tipo_sospensione')
          .success(function(data, status, headers, config) {
            $scope.tipo_sospensione = new (sospensioniMngr(data))();
            console.log("tipo sospensione:");
            console.log($scope.tipo_sospensione);
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nella lettura delle sospensioni del paziente.\nControlla la connessione al server!");
            $scope.tipo_sospensione = {};
          });
      };

      var init = function() {
        $scope.eForm.init();

        loadParameters();
        loadData();
     
      };


      var inserisciSospensione = function() {
        if(!$scope.eForm.data_sospensione ||
           !$scope.eForm.id_motivo_sospensione )
          return;

        $http.post("/data/pazienti/" + $routeParams.idPaziente + "/sospensioni/inserisci", $scope.tipo_sospensione.getSospensione())
          .success(function(data, status, headers, config) {
            //growl.addSuccessMessage("Sospensione salvata con successo");
            init();
          })
          .error(function(data, status, headers, config) {
            var msg  = "Salvataggio della sospensione fallito!";
                msg += "codice: " + status;
            growl.addErrorMessage(msg);                
          });
      }


      var aggiornaSospensione = function() {
        var url = "/data/pazienti/" + $routeParams.idPaziente;
          url += "/sospensioni/" ;
          url += $scope.eForm.idterapia_sospensione;
          url += "/aggiorna";

        $http.post(url, $scope.tipo_sospensione.getSospensione())
          .success(function(data, status, headers, config) {
            init();
          })
          .error(function(data, status, headers, config) {
            var msg  = "Salvataggio della sospensione fallito!";
                msg += "codice: " + status;
            growl.addErrorMessage(msg);                
          });
      }

      $scope.cancellaSospensione = function(idterapia_sospensione) {
        var url = "/data/pazienti/" + $routeParams.idPaziente;
          url += "/sospensioni/" ;
          url += idterapia_sospensione;
          url += "/cancella";

        var sospensione = _.find($scope.sospensioni, function(s) { return s.idterapia_sospensione == idterapia_sospensione});
        $http.post(url, sospensione)
          .success(function(data, status, headers, config) {
            init();
          })
          .error(function(data, status, headers, config) {
            var msg  = "Salvataggio della sospensione fallito!";
                msg += "codice: " + status;
            growl.addErrorMessage(msg);                
          });
      }



      $scope.aggiungiSospensione = function() {
        if($scope.eForm.idterapia_sospensione)
          aggiornaSospensione();
        else
          inserisciSospensione();
      };

      init();

    }
  ]);
})();

