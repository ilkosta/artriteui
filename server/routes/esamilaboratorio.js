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

		var query = 'INSERT INTO artrite.esami_laboratorio (id_paziente,tempo,hb,wbc,' +
						'neutrofili,ast,alt,ves,pcr,colesterolo,' +
						'c_hdl,c_ldl,trigliceridi,data_esame) ';
		query += ' VALUES ( ? ,?, ?, ?,' + 
						     '? , ?, ?, ? , ? , ?, ' +
						    '? ,  ?, ? , ?)';

		var fields = [req.body.id_paziente,req.body.tempo,req.body.hb,req.body.wbc,req.body.neutrofili,
					  req.body.ast ,req.body.alt,req.body.ves,req.body.pcr,req.body.colesterolo,
					  req.body.c_hdl,req.body.c_ldl,req.body.trigliceridi,moment(req.body.data_esame).format('YYYY-MM-DD')];

		mysql_conn.query(query, fields, function(err, result) {
			if (err)
				notify_problem(res, query, err, fields);

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
		if (req.params.tempo != req.body.tempo) {
			res.send(500);
			return;
		}

			// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();
		// query insert 
		var query_delete = 'DELETE FROM artrite.esami_laboratorio ';
		query_delete += ' WHERE id_paziente= ? and tempo = ? and id_esami_laboratorio';
		var fields = [req.body.id_paziente, req.body.tempo, req.body.id_esami_laboratorio];

		mysql_conn.query(query_delete, fields, function(err, result) {
			if (err)
				notify_problem(res, query_delete, err, fields);
			res.send(200, {
				insertId: result.insertId
			});
		});
		mysql_conn.end();

}

}());