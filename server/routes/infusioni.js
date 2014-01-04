(function() {
	'use strict';

	var _ = require('lodash');
	var moment = require('moment');
	var date_utils = require('../utils/date.js');
	var mysql_connector = require('../db/config.js');
	var notify_problem = require('../utils/problem_notifier.js').notify_problem;

	exports.ins = function(req, res, next) {

		if (req.body.length === 0)
			return;

		if (!date_utils.isDateInRange(req.body.data_infusione)) {
			notify_problem(res, 'date_utils.isDateInRange', 'data non valida');
			return;
		}

		var d_infusione = moment(req.body.data_infusione).format('YYYY-MM-DD');

		var db = mysql_connector.createConnection();
		db.connect();
		db.beginTransaction(function(err) {
			if (err) notify_problem(res, 'connection', err);

			var qry = "SELECT * FROM artrite.infusioni_tcz WHERE  id_paziente = ? and data_infusione = ?";
			var params = [req.params.idPaziente, d_infusione];
			db.query(qry, params, function(err, r, f) {
				if (err) {
					notify_problem(res, qry, err, params, db);
					return;
				}

				if (r.length !== 0) {
					db.rollback(function() {});
					res.send('ok');
					return;
				}

				qry = "INSERT INTO artrite.infusioni_tcz(id_paziente,data_infusione) VALUES(?,?)";
				params = [req.params.idPaziente, d_infusione];
				db.query(qry, params, function(err) {
					if (err) {
						notify_problem(res, qry, err, params, db);
						return;
					}


					db.commit(function(err) {
						if (err) notify_problem(res, 'commit', err, [], db);
						else res.send('ok');
					});
				});
			});
		});
	};


	exports.del = function(req, res, next) {

		if (req.body.length === 0)
			return;

		if (!date_utils.isDateInRange(req.body.data_infusione)) {
			notify_problem(res, 'date_utils.isDateInRange', 'data non valida');
			return;
		}

		var d_infusione = moment(req.body.data_infusione).format('YYYY-MM-DD');

		var db = mysql_connector.createConnection();
		db.connect();
		db.beginTransaction(function(err) {
			if (err) notify_problem(res, 'connection', err);

			var qry = "SELECT * FROM artrite.infusioni_tcz WHERE  id_paziente = ? and data_infusione = ?";
			var params = [req.params.idPaziente, d_infusione];
			db.query(qry, params, function(err, r, f) {
				if (err) {
					notify_problem(res, qry, err, params, db);
					return;
				}

				if (r.length === 0) {
					db.rollback(function() {});
					res.send('ok');
					return;
				}

				qry = "DELETE FROM artrite.infusioni_tcz WHERE id_paziente = ? AND data_infusione = ?";
				params = [req.params.idPaziente, d_infusione];
				db.query(qry, params, function(err) {
					if (err) {
						notify_problem(res, qry, err, params, db);
						return;
					}

					db.commit(function(err) {
						if (err) notify_problem(res, 'commit', err, [], db);
						else res.send('ok');
					});
				});
			});
		});
	};


}());