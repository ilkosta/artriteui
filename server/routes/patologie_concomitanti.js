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

		if(!req.body.idtipo_malattia) {
			notify_problem(res, 'controllo parametri', 'req.body.idtipo_malattia non presente!');
			return;
		}

		// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();
		// query insert 
		var query_ins = 'INSERT INTO artrite.anamnesi (id_paziente,id_tipo_malattia, descrizione )';
		query_ins += ' VALUES ( ?, ?, ?)';

		var fields = [req.body.id_paziente, req.body.idtipo_malattia, req.body.descrizione];

		mysql_conn.query(query_ins, fields, function(err, result) {
			if (err)
				notify_problem(res, query_ins, err, fields);

			res.send(200, {
				insertId: result.insertId
			});
		});
		mysql_conn.end();
	};

	exports.del = function(req, res, next) {
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
		var query_delete = 'DELETE FROM artrite.anamnesi ';
		query_delete += ' WHERE id_paziente= ? and idpatologia_concomitante = ?';
		var fields = [req.body.id_paziente, req.body.idpatologia_concomitante];

		mysql_conn.query(query_delete, fields, function(err, result) {
			if (err)
				notify_problem(res, query_delete, err, fields);
			res.send(200, {
				insertId: result.insertId
			});
		});
		mysql_conn.end();
	};


}());