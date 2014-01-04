
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var _    = require('lodash');
var moment = require('moment');


var notify_problem = require('./utils/problem_notifier.js').notify_problem;

// personal libs
var mysql_connector = require('./db/config.js');
var dev_env = require('./environments/dev.js');
var date_utils = require('./utils/date.js');

// ----------------------------------------------------------------------------
// rotte
// ----------------------------------------------------------------------------
var app = express();

dev_env.configure_env(app);

require('./routes/get.js').add_simple_get(app);

// paziente
var paziente = require('./routes/paziente.js');
app.post('/data/pazienti/pazientenuovo', paziente.ins);

// diagnosi
var diagnosi = require('./routes/diagnosi.js');
app.get('/data/pazienti/:idPaziente/diagnosimalattia', diagnosi.get );
app.post('/data/pazienti/:idPaziente/diagnosimalattia', diagnosi.set);

// infusioni
var infusioni = require('./routes/infusioni.js');
app.post('/data/pazienti/:idPaziente/infusioni/tcz/aggiungi', infusioni.ins);
app.post('/data/pazienti/:idPaziente/infusioni/tcz/cancella', infusioni.del);

// fattori di rischio / patologie concomitanti
var patologie_concomitanti = require('./routes/patologie_concomitanti.js');
app.post ('/data/pazienti/:idPaziente/patologie_concomitanti' , patologie_concomitanti.ins);
app.post ('/data/pazienti/:idPaziente/patologie_concomitanti/cancella' , patologie_concomitanti.del);

//terapie_pre
var terapie_pre = require('./routes/terapie_pre.js');
app.post ('/data/pazienti/:idPaziente/terapie_pre', terapie_pre.ins);
app.post ('/data/pazienti/:idPaziente/terapie_pre/cancella', terapie_pre.del);

// terapia
var terapie_concomitanti = require('./routes/terapie_concomitanti.js')
  , terapia_farmaco = require('./routes/terapia_farmaco.js');
app.post ('/data/pazienti/:idPaziente/terapie_concomitanti' , terapie_concomitanti.ins);
app.post ('/data/pazienti/:idPaziente/terapia_farmaco' , terapia_farmaco.ins);
app.put ('/data/pazienti/:idPaziente/terapia_farmaco' , terapia_farmaco.upd);

// terapia valutazione
var terapia_valutazione = require('./routes/terapia_valutazione.js');
app.post('/data/pazienti/:idPaziente/terapia_valutazione/:tempo/cancella' , terapia_valutazione.del);
app.post('/data/pazienti/:idPaziente/terapia_valutazione' , terapia_valutazione.ins);


app.post('/data/pazienti/:idPaziente/sospensioni/:idterapia_sospensione/aggiorna', function(req, res, next) {
  if(req.body.length === 0) 
    notify_problem(res,'req.body.length === 0');

  if(!date_utils.isDateInRange(req.body.data_inizio))
    notify_problem(res,'data_inizio non valida!');

  if(!date_utils.isDateInRange(req.body.data_fine))
    notify_problem(res,'data_fine non valida!');

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
          qry +=  "id_sospensione=? ";
        qry +=  "WHERE idterapia_sospensione = ? ";
        qry +=  "  and exists( ";
        qry +=  "   select * from terapia t ";
        qry +=  "   where t.id_paziente = ? ";
        qry +=  "     and t.idterapia = terapia_sospensione.id_terapia)";
    var parameters = [
        req.body.id_sospensione_dettaglio
      , req.body.tipo_sospensione
      , moment(req.body.data_inizio).format('YYYY-MM-DD')
      , moment(req.body.data_fine).format('YYYY-MM-DD')
      , req.body.note
      , req.body.id_sospensione
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
});

app.post('/data/pazienti/:idPaziente/sospensioni/:idterapia_sospensione/cancella', function(req, res, next) {
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
        qry +=  "WHERE idterapia_sospensione = ? and and exists (";
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
});
  
app.post('/data/pazienti/:idPaziente/sospensioni/inserisci', function(req, res, next) {
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

      qry =   "INSERT INTO terapia_sospensione(id_terapia, id_sospensione_dettaglio, tipo_sospensione, data_inizio, data_fine, note, id_sospensione) ";
      qry +=   "                        VALUES(?,           ?,                        ?,              ?,            ?,          ?,    ?)";
      params = [
          id_terapia
        , req.body.id_sospensione_dettaglio
        , req.body.tipo_sospensione
        , moment(req.body.data_inizio).format('YYYY-MM-DD') 
        , moment(req.body.data_fine).format('YYYY-MM-DD')
        , req.body.note
        , req.body.id_sospensione
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
});
  

















http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
