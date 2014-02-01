(function() {
  'use strict';

  var _ = require('lodash');
  var moment = require('moment');
  var date_utils = require('../utils/date.js');
  var mysql_connector = require('../db/config.js');
  var notify_problem = require('../utils/problem_notifier.js').notify_problem;

  exports.del = function(req, res, next) {
    if(req.params.idTerapia != req.body.idterapia_concomitante)
      return res.send(302);

    var db  = mysql_connector.createConnection()
      , qry = 'DELETE FROM terapia_concomitante WHERE idterapia_concomitante = ?'
      , params = [req.body.idterapia_concomitante];

    db.connect();
    db.query(qry, params, function(err,r) {
      if(err)
        notify_problem(res, qry, err, params);

      res.send('ok');
    });
    db.end();
  };

  exports.ins = function(req, res, next) {
    
    var idPazienteOk = function() {
      var id_paziente = +req.body.id_paziente;

      if (req.params.idPaziente != id_paziente)
        return false;

      return true;
    }


    if (!idPazienteOk()) {
      res.send(500);
      return;
    }


    // apertura connessione db
    var mysql_conn = mysql_connector.createConnection();
    mysql_conn.connect();
    mysql_conn.beginTransaction( function(err) {

      // -------------------------------------------------------
      // check the input
      // -------------------------------------------------------
      var chkQry = function(qry, db, errFn) {
        return function(fields) {
          if(!fields)
            return;

          mysql_conn.query(qry, fields, function(err, result) {
            if (err) {
              errFn(qry, err, fields);
              throw err;
            }

            if (result[0] === 0) {
              errFn(qry, "parametro non corretto!", fields);
              throw err;
            }
          });
        }
      };

      var errFn = function(qry, err, fields) {
        return notify_problem(res, qry, err, fields, mysql_conn);
      };

      var input_checker = {
        id_terapia: chkQry('select count(*) from terapia where idterapia = ?', mysql_conn, errFn),
        id_tipo_farmaco: chkQry('select count(*) from tipo_farmaco where idtipo_farmaco = ? and tipo_famiglia_farmaco = 1 /*dmard*/', mysql_conn, errFn),
        dose: function(d) {
          return +d > 0;
        }
        //, tempo: function(t) { return t > 0; }
        ,
        d_inizio: function(d) {
          return (d) ? date_utils.isDateInRange(d,'2005-01-01') : true;
        },
        d_fine: function(d, inputObj) {
          if(!d) 
            return true;

          var valid = date_utils.isDateInRange(d,inputObj.d_inizio);

          return valid;
        },
        id_tipo_motivo_sospensione: chkQry('select count(*) from tipo_sospensione where idtipo_motivo_sospensione = ?', mysql_conn, errFn)
      };


      // verifico i requisiti dell'input
      try {
        _.forOwn(input_checker, function(fn, k, o) {
          fn(req.body[k], req.body);
        });
      } catch (e) {
        return;
      }


      var save = function(qry, par) {
        mysql_conn.query(qry, par, function(err, result) {
          if (err)
            return notify_problem(res, qry, err, par); 

          mysql_conn.commit(function(err) {
            if(err) 
              notify_problem(res,'commit',err, [],db);
            else res.send('ok');
          });
          
        });
      };


      var qry = "", par = "";

      // se la req ha un idterapia_concomitante esistente, allora è un update
      if (req.body.idterapia_concomitante) {
        qry  = 'SELECT * ';
        qry += ' FROM terapia_concomitante';
        qry += ' where idterapia_concomitante = ?';
        par = req.body.idterapia_concomitante;

        mysql_conn.query(qry, par, function(err, result) {
          if (err) 
            return notify_problem(res, qry, err, par);  

          // update
          qry = ' UPDATE terapia_concomitante ';
          qry +=' SET id_terapia=?';
          qry +=' , id_tipo_farmaco=?';
          qry +=' , dose=?';
          qry +=' , id_paziente=?';
          qry +=' , tempo=?';
          qry +=' , d_inizio=?';
          qry +=' , d_fine=?';
          qry +=' , note=?';
          qry +=' , idtipo_motivo_sospensione=?';
          qry +=' WHERE ';
          qry +=' idterapia_concomitante = ?';
          par = [req.body.id_terapia , req.body.id_tipo_farmaco ,req.body.dose ,req.body.id_paziente 
                ,req.body.tempo ,req.body.d_inizio ,req.body.d_fine ,req.body.note ,req.body.idtipo_motivo_sospensione 
                ,req.body.idterapia_concomitante];

          return save(qry,par);
        });
      }
      else {
        qry = 'INSERT INTO terapia_concomitante';
        qry += '  (id_terapia, id_tipo_farmaco, dose, id_paziente, tempo, d_inizio, d_fine, note, idtipo_motivo_sospensione) ';
        qry += '  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        par = [ req.body.id_terapia , req.body.id_tipo_farmaco ,req.body.dose ,req.body.id_paziente 
                ,req.body.tempo ,req.body.d_inizio ,req.body.d_fine ,req.body.note 
                ,req.body.idtipo_motivo_sospensione ];

        return save(qry,par);

      }
    });
  };

}());