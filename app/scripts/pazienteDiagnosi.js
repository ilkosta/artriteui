// (function (){
//   var mod = angular.module('app.controllers');

//   mod.controller('PazienteDiagnosiCtrl', [
//     '$scope', '$location', '$routeParams','Restangular',
//     function($scope,$location, $routeParams,Restangular) {
//       Restangular.one('pazienti', $routeParams.idPaziente).one('diagnosimalattia').get()
//         .then(
//           function(diagnosi_malattia){
//             $scope.diagnosi_malattia = diagnosi_malattia[0];
//           },
//           // err
//           function(response) {
//             // alert ?
//             // funzione comune ?
//             console.log(response);
//           }
//         );
//     }
//   ]);

// }());
