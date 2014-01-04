
(function (){
  var mod = angular.module('app.controllers');

  mod.controller('PazienteDiagnosiEditCtrl', [
    '$scope', '$routeParams',
    '$http', 'calendar' , 'growl', 
    'loadDataListIntoScope',
    function(
        $scope, $routeParams,
        $http, calendar, growl,
        loadDataListIntoScope) {

      $scope.formState = {};
      
      var dataUrl = {
        diagnosi: '/data/pazienti/' + $routeParams.idPaziente + '/diagnosimalattia'
      , infusioni: '/data/pazienti/' + $routeParams.idPaziente + '/infusioni/tcz'
      , ins_infusione: '/data/pazienti/' + $routeParams.idPaziente + '/infusioni/tcz/aggiungi'
      , del_infusione: '/data/pazienti/' + $routeParams.idPaziente + '/infusioni/tcz/cancella'
      };

      // relazione tra modello e vista...
      var initInfusioni = function() {
        $scope.formState.ins_infusione = false;
        $scope.formState.show_infusioni = false;

        //TODO: non funziona l'inzializzazione della data al giorno di oggi
        //$scope.nuova_infusione = moment(); //.format('DD-MM-YYYY');

        $http.get(dataUrl.infusioni)
          .success(function(data, status, headers, config) {
            $scope.infusioni = data || [];
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nel caricamento delle infusioni del paziente.\nControlla la connessione al server!");
          });

        $scope.nuova_infusione = new Date();
      }


      var Init = function() {

        loadDataListIntoScope(
          $scope,
          [ 'tipo_risposta' , 'malattia_ric' ],
          function(p) { return '/data/_' + p;}
        );        

        $http.get(dataUrl.diagnosi)
          .success(function(data, status, headers, config) {
            $scope.diagnosi = data || {};
            $scope.master   = angular.copy($scope.diagnosi);

            if(_.isEmpty($scope.diagnosi))
              $scope.diagnosi.data_diagnosi = new Date();
          })
          .error(function(data, status, headers, config) {
            growl.addErrorMessage("Errore nel caricamento della diagnosi del paziente.\nControlla la connessione al server!");
            $scope.diagnosi = $scope.master = {};
          });


        initInfusioni();
        
      };

      $scope.getTipiRisposta = function() {
        var tipi_risp = _.map($scope.tipo_risposta, function(ts) {
          switch(ts.risposta) {}
        });
        return tipi_risp;
      }

      $scope.Cancel = function() {
        $scope.diagnosi = angular.copy( $scope.master );
        // or call $scope.Init() to reload
      };
      
      $scope.dataDiagnosiValida = function(_d) {
        // http://angular-ui.github.io/ui-utils/
        // https://github.com/angular-ui/ui-utils#validate
        var d = moment(_d, 'DD-MM-YYYY');
        if( !d.isValid() )
          return false;

        var min = moment().subtract('years',10);
        var max = moment();

        if( d.isBefore(min) )
          return false;
        if( d.isAfter(max) )
          return false;
      };


      $scope.inQuestoMese = function(_d) {
        if(!_d) return false;
        //var d = moment(_d, 'DD-MM-YYYY');
        var d = moment(_d);
        if( !d.isValid() )
          return false;

        var min = moment().subtract('days',30);
        return !d.isBefore(min);
      };

      $scope.Save = function() {
        $scope.formState.saving = true;
        // check of diagnosi_malattia before save

        // allign the values
        var malattie = _.groupBy($scope.malattia_ric,"idtipo_malattia");

        $scope.diagnosi.malattia = (_.groupBy($scope.malattia_ric,"idtipo_malattia")[$scope.diagnosi.cod_malattia][0]).descrizione;
        
        $http.post(dataUrl.diagnosi, $scope.diagnosi)
          .success(function(data, status, headers, config) {
                growl.addSuccessMessage("Diagnosi salvata con successo");
                $scope.formState.saving = false;
                Init();
              })
              .error(function(data, status, headers, config) {
                var msg  = "Salvataggio della diagnosi fallito!";
                    msg += "codice: " + status;
                growl.addErrorMessage(msg);
                $scope.formState.saving = false;
              });
      };

      function save_infusione(infusioni_da_salvare) {
        $http.post(dataUrl.ins_infusione, infusioni_da_salvare)
          .success(function(data, status,heades,config) {
            //growl.addSuccessMessage("infusioni aggiornate");
            initInfusioni();
          })
          .error(function(data, status, headers, config) {
            var msg  = "Aggiornamento delle infusioni fallito!";
                msg += "data:   " + data;
                msg += "status: " + status;
            growl.addErrorMessage(msg);
            initInfusioni();
          });
      }

      $scope.setInfToDelete = function(i) { $scope.formState.infusione_da_cancellare = i; }

      $scope.cancellaInfusione = function() {
        var da_cancellare = $scope.infusioni[$scope.formState.infusione_da_cancellare];

        $http.post(dataUrl.del_infusione, da_cancellare)
          .success(function(data, status,heades,config) {
            //growl.addSuccessMessage("infusioni aggiornate");
            initInfusioni();
          })
          .error(function(data, status, headers, config) {
            var msg  = "Aggiornamento delle infusioni fallito!";
                msg += ", data:   " + data;
                msg += ", status: " + status;
            growl.addErrorMessage(msg);
            initInfusioni();
          });
      }

      $scope.add_infusione = function() {
        save_infusione({data_infusione:$scope.nuova_infusione});
      };

      $scope.isUnchanged  = function(diagnosi) {
        return angular.equals($scope.master, diagnosi);
      };

      // calendar management
      var cal = calendar($scope);
      $scope.openCalendar = cal.open;
      $scope.today        = cal.today;

      Init();
    }
  ]);

}());