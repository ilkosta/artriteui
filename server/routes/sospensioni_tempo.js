(function () {
  'use strict';
  var _ = require('lodash');
  var moment = require('moment');
  var date_utils = require('../utils/date.js');
  var mysql_connector = require('../db/config.js');
  var notify_problem = require('../utils/problem_notifier.js').notify_problem;
 

  exports.get = function(req, res, next) {
       var mysql_conn = mysql_connector.createConnection();
        mysql_conn.connect();
        var data = req.query.datasospensione;

        data = data.replace( /"/g,"");
        var qry_select =   "select Count(*) as numero_infusioni from infusioni_tcz ";
        qry_select +=   "where id_paziente = ? and data_infusione < ? ";
        var param_select = [ req.params.idPaziente , date_utils.getDate(data) ];
        
        mysql_conn.query(qry_select, param_select, function(err, rows, f) {
                   
          if (err) notify_problem(res, param_select, err);
          res.send(rows);
        });
    
  };

exports.getFolloup = function(req, res, next) {
  debugger;
       var mysql_conn = mysql_connector.createConnection();
        mysql_conn.connect();
        var data = req.query.datasospensione;

        data = data.replace( /"/g,"");
        var qry_select = "select  period_diff(date_format( ?, '%Y%m'), date_format(data_inizio, '%Y%m')) as mesi from terapia";
            qry_select +=" where id_paziente = ? ";
        var param_select = [  date_utils.getDate(data) , req.params.idPaziente];
        
        mysql_conn.query(qry_select, param_select, function(err, rows, f) {
                   
          if (err) notify_problem(res, param_select, err);
          res.send(rows);
        });
    
  };
 
}());