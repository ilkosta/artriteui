(function () {
	'use strict';

	var _ = require('lodash');
	var moment = require('moment');
	var date_utils = require('../utils/date.js');
	var mysql_connector = require('../db/config.js');
	var notify_problem = require('../utils/problem_notifier.js').notify_problem;


	exports.ins = function(req,res,next){
  // acluni controlli
  if(!date_utils.isDateInRange(req.body.datadinascita, moment().subtract('years',100)))
    notify_problem(res,"chek input: data inizio = ?","data di inizio non valida",[req.body.datadinascita]);

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  //debugger;
  var query =   'INSERT INTO artrite.paziente (NOME, COGNOME,DATA_NASCITA,CODICE_FISCALE,sesso)';
      query +=  ' VALUES( ?, ?, ?, ? ,? )';
      var fields =  [ req.body.nome, req.body.cognome
                    , moment(req.body.datadinascita).format('YYYY-MM-DD')
                    , req.body.codicefiscale,req.body.gender
                    ];

    mysql_conn.query(query, fields, function(err, result) {
    if(err) 
      notify_problem(res,query,err,fields);

    res.send(200, {insertId: result.insertId});
  });
  mysql_conn.end();
};
	
}());