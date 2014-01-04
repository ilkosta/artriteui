(function() {
  'use strict';

  var _ = require('lodash');
  var qryLogger = require('./qry_logger.js');

  exports.notify_problem = function(res, qry, what, params, conn) {
    qry = qryLogger.fillqry(qry, params);
    console.log("errore eseguendo: " + qry);
    console.log(what);
    res.send(500, {
      err: what
    });
    if (conn)
      conn.rollback();
  };

}());