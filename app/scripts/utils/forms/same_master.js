angular.module('utils_forms',[]).factory( 'sameMaster',
  function() {
  return function($scope) { // factory with the know of $scope
    //return function(what) {}
    
    return function(what) {
      if( what === undefined ) 
        return false;
      
      //var sm = function() { 
        return angular.equals(what, $scope.master);           
      /*};
      
      return _.debounce(sm, 200);  */
    } 
  }
});

angular.module('utils_forms').factory('loadDataListIntoScope',
  ['$http', function($http) {
    return function($scope, data_array, fn_url, fn_param_name) {
      fn_url        = fn_url        || function(p) {return p;}
      fn_param_name = fn_param_name || function(p) {return p;}
      
      _(data_array).each( function(param) {              
        var url = fn_url(param);
        var param_name = fn_param_name(param);
        
        $http({method:'GET', url: url, cache:'true'})
        .success( function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
          $scope[param_name] = data;
        })
        .error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.        
          console.log('errore invocando: GET ' + url);
          _([data, status, headers, config]).each(console.log);
        });
      });
    }
  }]);


angular.module('utils_forms').factory( 'decodeCodesInObject' , 
  function() {
    return function(obj_a, obj_bs) { return {
      // chiamata di esempio
      //
      // decodeCodesInObject(diagnosi, malattia_ric)
      //  .where('cod_malattia').is_to('idtipo_malattia')
      //  .as('malattia').is_to('descrizione')
      //  .by('cod_malattia');
      //
      // effetto: allinea il valore di diagnosi.malattia leggendo da mattia.descrizione 
      // per il valore corrispondente all'oggetto malattia 
      // dove malattia.idtipo_malattia == diagnosi.cod_malattia      
      
      where:  function(ax) {
        return {
          is_to: function(bx) {
            return {
              as: function(ay) {
                return {
                  is_to: function(by) {
                    return {
                      by: function(k) {
                        if( k != ax && k != ay ) return;
                        
                        var b_k = (k === ax ) ? bx : by;    // key of obj_b
                        var b_v = (b_k === by ) ? bx : by;  // value of obj_b
                        var a_v = (k === ax ) ? ay : ax;
                        
                        // selected b from obj_bs
                        var b = _.find( obj_bs, function(b) {
                          return b[b_k] == obj_a[k];
                        });
                        
                        obj_a[a_v] = b[b_v];
                      }
                    }
                  }
                }
              }
            }
          }
        };
      }
    }
    };
  } 
);