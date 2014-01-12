(function () {
	'use strict';

	var _ = require('lodash');
	var moment = require('moment');
	var date_utils = require('../utils/date.js');
	var mysql_connector = require('../db/config.js');
	var notify_problem = require('../utils/problem_notifier.js').notify_problem;


	exports.upd = function(req,res,next){
  // acluni controlli
  if(!date_utils.isDateInRange(req.body.DATA_NASCITA, moment().subtract('years',100)))
    notify_problem(res,"check input: data inizio = ?","data di inizio non valida",[req.body.datadinascita]);

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var query =   'UPDATE artrite.paziente';
      query +=  ' SET NOME=  ?, COGNOME = ?, DATA_NASCITA= ?, CODICE_FISCALE = ? , SESSO = ? ';
      query +=  ' WHERE  idPAZIENTE = ? ';
      var fields =  [ req.body.NOME, req.body.COGNOME
                    , moment(req.body.DATA_NASCITA).format('YYYY-MM-DD')
                    , req.body.CODICE_FISCALE,req.body.sesso, req.body.idPAZIENTE
                    ];

    mysql_conn.query(query, fields, function(err, result) {
    if(err) 
      notify_problem(res,query,err,fields);
    else res.send(200, {insertId: result.insertId});
  });
  mysql_conn.end();
};
	
}());