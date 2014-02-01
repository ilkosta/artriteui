(function () {
  'use strict';
  var _ = require('lodash');
  var moment = require('moment');
  var date_utils = require('../utils/date.js');
  var mysql_connector = require('../db/config.js');
  var notify_problem = require('../utils/problem_notifier.js').notify_problem;


  exports.ins = function(req, res, next) {
    if(req.body.length === 0) 
      notify_problem(res,'','req.body.length === 0');

    var db = mysql_connector.createConnection();
    db.connect();
    db.beginTransaction( function(err) {
      if (err) 
        notify_problem(res,'connection',err);
      // devi prendere l'id terapia

      var qry = "SELECT idterapia FROM terapia where id_paziente = ? limit 1";
      var params = [req.params.idPaziente];
      db.query(qry, params, function(err, r, f) {
        if (err) 
          notify_problem(res,qry,err, params,db);

        var id_terapia = r[0].idterapia;
        if(!id_terapia)
          notify_problem(res,"id_terapia nullo!", new Error("id_terapia nullo!"),[],db);        
        
        var df =req.body.data_fine;
        if(req.body.data_fine == null) df = null;
        else moment(req.body.data_fine).format('YYYY-MM-DD');

        qry =   "INSERT INTO terapia_sospensione(id_terapia, id_sospensione_dettaglio, tipo_sospensione, data_inizio, data_fine, note, id_sospensione , num_infusioni_fatte , follow_up) ";
        qry +=   "                        VALUES(?,           ?,                        ?,              ?,            ?,          ?,    ?,               ?,                    ?)";
        params = [
            id_terapia
          , req.body.id_sospensione_dettaglio
          , req.body.tipo_sospensione
          , moment(req.body.data_inizio).format('YYYY-MM-DD') 
          , df
          , req.body.note
          , req.body.id_sospensione
          , req.body.num_infusioni_fatte
          , req.body.follow_up
          ];
        db.query(qry, params, function(err, r, f) {
          if (err) 
            notify_problem(res,qry,err, params,db);
          
          db.commit(function(err) {
            if(err) 
              notify_problem(res,'commit',err, [],db);
            else res.send('ok');
          });
        });
      });    
    });
  };

  exports.upd = function(req, res, next) {
    var save =1;
    if(req.body.length === 0) {
      notify_problem(res,'req.body.length === 0');
      save =0;
    }

    if(!date_utils.isDateInRange(req.body.data_inizio)){
      notify_problem(res,'data_inizio non valida!');
    save =0;
    }

    var df =req.body.data_fine;
    var di =moment(req.body.data_inizio).format('YYYY-MM-DD');
    if(req.body.data_fine == null) df = null;
    else {
        if(!date_utils.isDateInRange(req.body.data_fine)){
            notify_problem(res,'data_fine non valida!');
            save =0;
          }
        df = moment(req.body.data_fine).format('YYYY-MM-DD'); 

     if( moment(df).isBefore(di)){ 
        notify_problem(res,'data_fine non valida!');
        save =0;
      }  
    }

if(save ===1 ){
    var db = mysql_connector.createConnection();
    db.connect();
    db.beginTransaction( function(err) {
      if (err) notify_problem(res,'connection',err);

      var qry =   "UPDATE terapia_sospensione ";
          qry +=  "SET id_sospensione_dettaglio=?, ";
            qry +=  "tipo_sospensione=?, ";
            qry +=  "data_inizio=?, ";
            qry +=  "data_fine=?, ";
            qry +=  "note=?, ";
            qry +=  "id_sospensione=?, ";
            qry +=  "num_infusioni_fatte =?, ";
            qry +=  "follow_up =? ";
          qry +=  "WHERE idterapia_sospensione = ? ";
          qry +=  "  and exists( ";
          qry +=  "   select * from terapia t ";
          qry +=  "   where t.id_paziente = ? ";
          qry +=  "     and t.idterapia = terapia_sospensione.id_terapia)";
      var parameters = [
          req.body.id_sospensione_dettaglio
        , req.body.tipo_sospensione
        , di
        , df
        , req.body.note
        , req.body.id_sospensione
        , req.body.num_infusioni_fatte
        , req.body.follow_up 
        , req.params.idterapia_sospensione
        , req.params.idPaziente
        ];
      db.query(qry, parameters, function(err, r, f) {
        if (err) 
          notify_problem(res,qry,err, parameters,db);
        
        db.commit(function(err) {
          if(err) 
            notify_problem(res,'commit',err,[],db);
          else res.send('ok');
        });
      });
    });
  }
  };

  exports.del = function(req, res, next) {
    if(req.body.length === 0) {
      notify_problem(res,'','req.body.length === 0');
      return;
    }

    if( req.body.idterapia_sospensione != req.params.idterapia_sospensione ) {
      notify_problem(res,'','dati tra req.body e req.params non corrispondenti');
      return;
    }


    var db = mysql_connector.createConnection();
    db.connect();
    db.beginTransaction( function(err) {
      if (err) notify_problem(res,'connection',err);

      var qry =   "DELETE FROM terapia_sospensione ";
          qry +=  "WHERE idterapia_sospensione = ? and exists (";
          qry +=  "    select * from terapia t";
          qry +=  "    where t.id_paziente = ?";
          qry +=  "      and t.idterapia = terapia_sospensione.id_terapia)";
      var params = [
          req.params.idterapia_sospensione
        , req.params.idPaziente
        ];
      db.query(qry, params, function(err, r, f) {
        if (err) 
          notify_problem(res,qry,err, params,db);
        
        db.commit(function(err) {
          if(err) 
            notify_problem(res,'commit',err,[],db);
          else res.send('ok');
        });
      });
    });
  };
    

  
}());