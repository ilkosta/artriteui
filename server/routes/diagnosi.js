(function() {
	'use strict';

	var mysql_connector = require('../db/config.js')
		, notify_problem = require('../utils/problem_notifier.js').notify_problem
		, _ = require('lodash')
		, moment = require('moment');


	exports.get = function(req, res, next) {
		// apertura connessione db
		var mysql_conn = mysql_connector.createConnection();
		mysql_conn.connect();

		// query
		var qry = 'SELECT * from artrite.vdiagnosimalattia where idPaziente =?';
		var params = [req.params.idPaziente];
		mysql_conn.query(qry, params, function(err, rows, fields) {
			if (err)
				notify_problem(res, qry, err, params);

			if (rows.lenght > 1)
				notify_problem(res, qry, "trovati più record vdiagnosimalattia", params);

			res.send(rows[0]);
		});
		mysql_conn.end();
	};


  var setMalattia = function(req, res, next) {
	
    //if(!req.body.idPaziente || !req.params.idPaziente)
      //return notify_problem('errore nel passaggio dei parametri (idPaziente)');

    // if (req.params.idPaziente != req.body.idPaziente)
      //return notify_problem('nel json ricevuto l\'idPaziente non coincide con quello el PUT');
  }

	exports.set = function(req, res, next) {
		// controllo dei dati ricevuti
		//debugger;
		// anticorpi: "no"
		// cod_malattia: 10
		// cod_tipo_malattia: "ric"
		// cognome: "Giuliodori"
		// data_diagnosi: "2010-08-25T00:00:00.000Z"
		// data_nascita: "1976-04-06T00:00:00.000Z"
		// fattore_reumatoide: "si"
		// idPaziente: 2
		// iddiagnosi_malattia: 4
		// malattia: "artrite psoriasica"
		// nome: "Costantino"

		function getNewConn() {
			var mysql_conn = mysql_connector.createConnection();
			mysql_conn.connect();
			return mysql_conn;
		}

		//debugger;
		//if (req.params.idPaziente != req.body.idPaziente)
		//	return notify_problem('nel json ricevuto l\'idPaziente non coincide con quello el PUT');


		var risposte_usate = _(['fattore_reumatoide', 'anticorpi'])
			.map(function(a) {
				return req.body[a];
			})
			.uniq().value();

		// apertura connessione db
		var mysql_conn = getNewConn();

		// INIZIO metodo normale

		// assumo la connessione come aperta...
		mysql_conn.query('select idtipo_risposta from artrite.tipo_risposta', function(err, r, fields) {
			if (err) notify_problem(res, 'select idtipo_risposta from artrite.tipo_risposta', err);

			var risposte_usabili = _.pluck(r, fields[0].name);
			if (_.difference(risposte_usate, risposte_usabili).length > 0)
				return notify_problem(res, 'select risposta from artrite.tipo_risposta', err);
		});
		mysql_conn.end();
		// FINE metodo normale


		// regola di validità: una diagnosi per paziente?
		var qry = 'select count(*) as num';
		qry += ' , min(iddiagnosi_malattia) as first_id';
		qry += ' from artrite.diagnosi_malattia';
		qry += ' where id_paziente = ?';
		var params = [req.params.idPaziente];
		mysql_conn = getNewConn();
		mysql_conn.query(qry, params, function(err, r, fields) {
			if (err) notify_problem(res, qry, params, err);
			var nr_diagnosi = r[0][fields[0].name];
			if (nr_diagnosi > 1) {
				return notify_problem(res, null, err);
			}
		});
		mysql_conn.end();


		mysql_conn = getNewConn();
		mysql_conn.beginTransaction(function(err) {
			if (err) notify_problem(res, 'begin tran', err, [], mysql_conn);
			qry = "SELECT iddiagnosi_malattia";
			qry += " FROM   artrite.diagnosi_malattia";
			qry += " WHERE  id_paziente = ?";
			params = [req.params.idPaziente];
			mysql_conn.query(qry, params, function(err, r, fields) {
				if (err) notify_problem(res, qry, err, params, mysql_conn);
				if (r.length === 1) {
					var id = r[0][fields[0].name];
					qry = 'update diagnosi_malattia';
					qry += ' set anticorpi = ?';
					qry += '   , cod_malattia = ?';
					qry += '   , data_diagnosi = ?';
					qry += '   , fattore_reumatoide = ?';
					qry += '   , iddiagnosi_malattia = ?';
					qry += ' where iddiagnosi_malattia = ?';
					params = [req.body.anticorpi, req.body.cod_malattia, moment(req.body.data_diagnosi).format('YYYY-MM-DD'), req.body.fattore_reumatoide, req.body.iddiagnosi_malattia, id];
					mysql_conn.query(qry, params, function(err, result) {
						if (err)
							notify_problem(res, qry, err, params, mysql_conn);

						mysql_conn.commit(function(err) {
							if (err) notify_problem(res, qry, err, [], mysql_conn);
							else
								res.send(200, {
									insertId: result.insertId
								});
						});
					});
				} else {

					qry = 'INSERT INTO diagnosi_malattia';
					qry += ' (anticorpi, cod_malattia, data_diagnosi, fattore_reumatoide, id_paziente)';
					qry += ' VALUES(?, ?, ?, ?, ?)';
					params = [req.body.anticorpi, req.body.cod_malattia, moment(req.body.data_diagnosi).format('YYYY-MM-DD'), req.body.fattore_reumatoide, req.params.idPaziente];
					mysql_conn.query(qry, params, function(err, result) {
						if (err)
							notify_problem(res, qry, err, params, mysql_conn);

						mysql_conn.commit(function(err) {
							if (err) notify_problem(res, qry, err, [], mysql_conn);
							else
								res.send(200, {
									insertId: result.insertId
								});
						});
					});
				}
			});
		});
	};

}());