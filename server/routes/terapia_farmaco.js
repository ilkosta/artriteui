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

		var query = 'INSERT INTO artrite.terapia (id_paziente, data_inizio)';
		query += ' VALUES ( ?, ?)';

		var fields = [req.body.id_paziente, moment(req.body.data_inizio).format('YYYY-MM-DD')];

		mysql_conn.query(query, fields, function(err, result) {
			if (err)
				notify_problem(res, query, err, fields);

			res.send(200, {
				insertId: result.insertId
			});
		});
		mysql_conn.end();
	};

	exports.upd = function(req, res, next) {
		if (req.body.lenght === 0) {
			res.send(500);
			return;
		}

		if (req.params.idPaziente != req.body.id_paziente) {
			res.send(500);
			return;
		}
		// apertura connessione db
		//debugger;
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();

		var query = 'UPDATE artrite.terapia  SET data_inizio = ? where  id_paziente = ? ';
		var fields = [moment(req.body.data_inizio).format('YYYY-MM-DD'), req.body.id_paziente];

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