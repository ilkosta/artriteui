(function() {
	'use strict';

	var _ = require('lodash');
	var moment = require('moment');
	var date_utils = require('../utils/date.js');
	var mysql_connector = require('../db/config.js');
	var notify_problem = require('../utils/problem_notifier.js').notify_problem;

	exports.ins = function(req, res, next) {

		if (req.body.lenght === 0) {
			res.send(500);
			return;
		}

		if (req.params.idPaziente != req.body.id_paziente) {
			res.send(500);
			return;
		}

		
		// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();
		// query insert 
		var query_ins = 'INSERT INTO artrite.terapia_farmacologica_pre (id_paziente,cod_tipo_farmaco)';
		query_ins += 'VALUES ( ?, ?)';

		var fields = [req.body.id_paziente, req.body.cod_tipo_farmaco];

		mysql_conn.query(query_ins, fields, function(err, result) {
			if (err)
				notify_problem(res, query_ins, err, fields);
			else
				res.send(200, {
					insertId: result.insertId
				});
		});
		mysql_conn.end();
	};

	exports.del = function(req, res, next) {
		if (req.body) {
			if (req.params.idPaziente != req.body.idPaziente)
				res.send(500);
		} else {
			res.send(500);
		}

		// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();
		// query insert 
		var query_delete = 'DELETE FROM artrite.terapia_farmacologica_pre ';
		query_delete += ' WHERE id_paziente= ? and idterapia_farmacologica_pre = ?';
		var fields = [req.body.idPaziente, req.body.idterapia_farmacologica_pre];

		mysql_conn.query(query_delete, fields, function(err, result) {
			if (err)
				notify_problem(res, query_delete, fields, params);

			res.send(200, {
				insertId: result.insertId
			});
		});
		mysql_conn.end();
	};


}());