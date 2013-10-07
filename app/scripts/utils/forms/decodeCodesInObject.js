
(function (){

  var mod = angular.module('utils_forms');
  mod.factory( 'decodeCodesInObject', function() {
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

}());