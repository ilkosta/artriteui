(function() {
	'use strict';


	var _ = require('lodash');
	var moment = require('moment');
	var date_utils = require('../utils/date.js');
	var mysql_connector = require('../db/config.js');
	var notify_problem = require('../utils/problem_notifier.js').notify_problem;


	exports.del = function(req, res, next) {

		if (req.params.idPaziente != req.body.id_paziente)
			res.send(500);

		if (req.params.tempo != req.body.tempo)
			res.send(500);

		// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();
		var qry = 'delete from artrite.terapia_valutazione where id_paziente = ? and tempo = ?';
		var params = [req.params.idPaziente, req.params.tempo];
		mysql_conn.query(qry, params, function(err, rows, fields) {
			if (err)
				notify_problem(res, qry, err, params);
			res.send(200);
		});
		mysql_conn.end();
	};



	exports.ins = function(req, res, next) {

		if (req.params.idPaziente === req.body.idPaziente)
			return notify_problem(res, 'nel json ricevuto l\'idPaziente non coincide con quello del PUT');

		// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();
		// query
		var query = 'INSERT INTO artrite.terapia_valutazione( ';
		query += ' id_paziente, art_dolenti, art_tumefatte, pcr, ves, vas_paziente, vas_medico, das28, sdai, cdai, tempo) ';
		query += ' VALUES( ?,    ?,          ?,              ?,  ?,    ?,            ?,          ?,    ?,    ?,    ?    )';


		var fields = [req.body.id_paziente, req.body.art_dolenti, req.body.art_tumefatte, req.body.pcr, req.body.ves, req.body.vas_paziente, req.body.vas_medico, req.body.das28, req.body.sdai, req.body.cdai, req.body.tempo];


		mysql_conn.query(query, fields, function(err, result) {
			if (err)
				notify_problem(res, query, err, fields);

			res.send(200, {
				insertId: result.insertId
			});
		});
		mysql_conn.end();
	};

}());