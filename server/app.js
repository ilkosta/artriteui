
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _    = require('lodash');
var moment = require('moment');

// personal libs
var mysql_connector = require('./db/config.js');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.enable('log actions');
  app.enable('env info');
  app.use(require('express').errorHandler({ dumpExceptions: true, showStack: true }));
}

// gestione degli errori
function logErrors(err, req, res, next) {
  console.error(err.stack);
  res.send(500, 'Something broke!');
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);



app.get('/', routes.index);
app.get('/users', user.list);

var simple_params = [
  { nome_parametro: 'tipo_risposta',
    qry: 'SELECT * FROM artrite.tipo_risposta'
  },
  { nome_parametro: 'farmaci_dimard',
    qry: 'SELECT * FROM artrite.tipo_farmaco where tipo_famiglia_farmaco=\'1\' '
  },
  { nome_parametro: 'farmaci_biologici',
    qry: 'SELECT * FROM artrite.tipo_farmaco where tipo_famiglia_farmaco=\'2\''
  },
  { nome_parametro: 'malattia_ric',
    qry: 'SELECT * FROM artrite.tipo_malattia where cod_tipo_malattia=\'ric\''
  },
  { nome_parametro: 'malattia_ptc',
    qry: 'SELECT * FROM artrite.tipo_malattia where cod_tipo_malattia=\'ptc\''
  },
  { nome_parametro: 'fattori_rischio',
    qry: 'select * from artrite.tipo_malattia where cod_tipo_malattia=\'fdr\''
  },
  { nome_parametro: 'cod_tipo_sospensione',
    qry: 'select * from cod_tipo_sospensione'
  },
  { nome_parametro: 'tipo_sospensione',
    qry: 'select * from vsospensione'
  }
];

var add_get = function(param) {
  // inject the route
  app.get('/data/_' + param.nome_parametro, function(req, res, next) {
    // apertura connessione db
    var mysql_conn = mysql_connector.createConnection();
    mysql_conn.connect();
    var pazienti;
    // query
      mysql_conn.query(param.qry, function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);    
    });
    mysql_conn.end();
  });
};

 _.each(simple_params, add_get);
//console.log(simple_params);

var add_paziente_simple_get = function(param) {
  // inject the route
  app.get('/data/pazienti/:idPaziente/' + param.nome_parametro, function(req, res, next) {
    // apertura connessione db
    var mysql_conn = mysql_connector.createConnection();
    mysql_conn.connect();
    var pazienti;
    var re = /\?/g;
    console.log("eseguo: " + param.qry.replace(re, req.params.idPaziente));
    // query
      mysql_conn.query(param.qry, [req.params.idPaziente] , function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);    
    });
    mysql_conn.end();
  });
};

var qry_paziente = [
  { nome_parametro: '',
    qry: 'SELECT * from artrite.vpazienti where idPaziente =?'
  },
  { nome_parametro: 'infusioni/tcz',
    qry: 'SELECT data_infusione from artrite.infusioni_tcz where id_paziente =? order by data_infusione desc'
  },
  { nome_parametro: 'terapie_pre',
    qry: 'SELECT * FROM artrite.vterapia_farmacologica_pre where idPaziente =?'
  },
  { nome_parametro: 'fattori_di_rischio',
    qry: 'SELECT a.*, t.descrizione as tipo_malattia FROM artrite.anamnesi a inner join artrite.tipo_malattia t on a.id_tipo_malattia= t.idtipo_malattia where t.cod_tipo_malattia = \'fdr\' and  a.id_paziente=?'
  },
  { nome_parametro: 'patologie_concomitanti',
    qry: 'SELECT a.*, t.descrizione as tipo_malattia FROM artrite.anamnesi a inner join artrite.tipo_malattia t on a.id_tipo_malattia= t.idtipo_malattia where t.cod_tipo_malattia = \'ptc\' and  a.id_paziente=?'
  },
  { nome_parametro: 'patologie_concomitanti',
    qry: 'SELECT a.*, t.descrizione as tipo_malattia FROM artrite.anamnesi a inner join artrite.tipo_malattia t on a.id_tipo_malattia= t.idtipo_malattia where t.cod_tipo_malattia = \'ptc\' and  a.id_paziente=?'
  },
  { nome_parametro: 'terapie_concomitanti',
    qry: 'SELECT tf.idtipo_farmaco, tf.nome, a.*, ter.id_paziente FROM artrite.tipo_farmaco tf inner join artrite.terapia_concomitante a on a.id_tipo_farmaco=tf.idtipo_farmaco inner join artrite.terapia ter on ter. idterapia = a.id_terapia where tf.tipo_famiglia_farmaco = \'1\' and ter.id_paziente=?'
  },
  
  { nome_parametro: 'terapia_farmaco',
    qry: 'select idterapia, id_paziente, data_inizio from artrite.terapia where id_paziente =?'
  },
  { nome_parametro: 'terapia_valutazione',
    qry: 'SELECT tv.* FROM artrite.terapia_valutazione tv where tv.id_paziente=?'
  },
  { nome_parametro: 'sospensioni',
    qry: 'select  tersosp.idterapia_sospensione' + 
'     ,   tersosp.id_terapia' + 
'     ,   tersosp.tipo_sospensione ' + 
'     ,   cts.descrizione as tipo_sospensione' + 
'     ,   tersosp.id_sospensione' + 
'     ,   ts.descrizione as sospensione' + 
'     ,   tersosp.id_sospensione_dettaglio' + 
'     ,   tsd.sospensione_dettaglio as dettaglio' + 
'     ,   tersosp.data_inizio' +
'     ,   tersosp.data_fine' +
'     ,   tersosp.note' +
' from terapia_sospensione as tersosp' + 
' join terapia t on tersosp.id_terapia = t.idterapia' +
' left join cod_tipo_sospensione cts on tersosp.tipo_sospensione = cts.cod_tipo_sospensione' + 
' join tipo_sospensione ts on tersosp.id_sospensione = ts.idtipo_motivo_sospensione' + 
' join tipo_sospensione_dettaglio tsd ' + 
'     on tersosp.id_sospensione_dettaglio = tsd.id_sospensione_dettaglio' + 
'     and tersosp.id_sospensione = tsd.id_tipo_sospensione' +
' where t.id_paziente = ?'
  }
];

_.each(qry_paziente, add_paziente_simple_get);

var isValidDate = function(_d) {
  if(!_d) return false;
  var d = moment(_d);
  var valid = d.isValid();
  valid = valid && d.isBefore(moment().add('days',1));
  valid = valid && d.isAfter(moment().subtract('years',10));
  return valid;
};

app.get('/data/pazienti', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;

  // query
    mysql_conn.query('SELECT * from artrite.vpazienti', function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});


app.get('/data/pazienti/:idPaziente/diagnosimalattia', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();

  // query
    mysql_conn.query('SELECT * from artrite.vdiagnosimalattia where idPaziente =?', [req.params.idPaziente]  , function(err, rows, fields) {
    if (err) throw err;

    if( rows.lenght > 1 ) {
      console.log("trovati più record vdiagnosimalattia per idPaziente = ",req.params.idPaziente);
      throw err;
    }
    
    res.send(rows[0]);    
  });
  mysql_conn.end();
});



app.post('/data/pazienti/:idPaziente/sospensioni/:idterapia_sospensione/aggiorna', function(req, res, next) {
  var notify_problem = function (res,qry,what,conn) {
    console.log("errore eseguendo: " + qry);
    console.log(what);
    res.send(500,{err:what}); // TODO.... da sistemare
    if(conn) 
      conn.rollback();
  };
  
  if(req.body.length === 0) 
    notify_problem(res,'req.body.length === 0','');

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
          qry +=  "id_sospensione=?";
        qry +=  "WHERE idterapia_sospensione = ? ";
        qry +=  "  and exists( ";
        qry +=  "   select * from terapia t ";
        qry +=  "   where t.id_paziente = ? ";
        qry +=  "     and t.idterapia = terapia_sospensione.id_terapia)";
    db.query(qry, [
        req.body.id_sospensione_dettaglio
      , req.body.tipo_sospensione
      , req.body.data_inizio
      , req.body.data_fine
      , req.body.note
      , req.body.id_sospensione
      , req.params.idterapia_sospensione
      , req.params.idPaziente
      ], function(err, r, f) {
      if (err) 
        notify_problem(res,qry,err,db);
      
      db.commit(function(err) {
        if(err) 
          notify_problem(res,'commit',err,db);
        else res.send('ok');
      });
    });
  });
});

app.post('/data/pazienti/:idPaziente/sospensioni/:idterapia_sospensione/cancella', function(req, res, next) {
  var notify_problem = function(res,qry,what,conn) {
    console.log("errore eseguendo: " + qry);
    console.log(what);
    res.send(500,{err:what}); // TODO.... da sistemare
    if(conn) 
      conn.rollback();
  };
  
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

    var qry =   "DELETE terapia_sospensione ";
        qry +=  "WHERE idterapia_sospensione = ? and and exists (";
        qry +=  "    select * from terapia t";
        qry +=  "    where t.id_paziente = ?";
        qry +=  "      and t.idterapia = terapia_sospensione.id_terapia)";
    db.query(qry, [
        req.params.idterapia_sospensione
      , req.params.idPaziente
      ], function(err, r, f) {
      if (err) 
        notify_problem(res,qry,err,db);
      
      db.commit(function(err) {
        if(err) 
          notify_problem(res,'commit',err,db);
        else res.send('ok');
      });
    });
  });
});
  
app.post('/data/pazienti/:idPaziente/sospensioni/inserisci', function(req, res, next) {
  var notify_problem = function(res,qry,what,conn) {
    console.log("errore eseguendo: " + qry);
    console.log(what);
    res.send(500,{err:what}); // TODO.... da sistemare
    if(conn) 
      conn.rollback();
  };
  
  if(req.body.length === 0) 
    notify_problem(res,'','req.body.length === 0');

  var db = mysql_connector.createConnection();
  db.connect();
  db.beginTransaction( function(err) {
    if (err) 
      notify_problem(res,'connection',err);
    // devi prendere l'id terapia
    var qry = "SELECT idterapia FROM terapia where id_paziente = ? limit 1";
    db.query(qry, [req.params.idPaziente], function(err, r, f) {
      if (err) 
        notify_problem(res,qry,err,db);

      var id_terapia = r[0].idterapia;
      if(!id_terapia)
        notify_problem(res,"id_terapia nullo!", new Error("id_terapia nullo!"),db);        

      qry =   "INSERT INTO terapia_sospensione(id_terapia, id_sospensione_dettaglio, tipo_sospensione, data_inizio, data_fine, note, id_sospensione) ";
      qry +=   "                        VALUES(?,           ?,                        ?,              ?,            ?,          ?,    ?)";
      db.query(qry, [
          id_terapia
        , req.body.id_sospensione_dettaglio
        , req.body.tipo_sospensione
        , req.body.data_inizio 
        , req.body.data_fine
        , req.body.note
        , req.body.id_sospensione
        ], function(err, r, f) {
        if (err) 
          notify_problem(res,qry,err,db);
        
        db.commit(function(err) {
          if(err) 
            notify_problem(res,'commit',err,db);
          else res.send('ok');
        });
      });
    });    
  });
});
  
  
app.post('/data/pazienti/:idPaziente/infusioni/tcz', function(req, res, next) {

  var notify_problem = function(res,qry,what,conn) {
    console.log("errore eseguendo: " + qry);
    console.log(what);
    res.send(500,{err:what}); // TODO.... da sistemare
    if(conn) 
      conn.rollback();
  };

  if(req.body.length === 0) 
    return;

  var db = mysql_connector.createConnection();
  db.connect();
  db.beginTransaction( function(err) {
    if (err) notify_problem(res,'connection',err);

    var qry =   "SELECT REPLACE( DATE_FORMAT(data_infusione,GET_FORMAT(DATE,'ISO')), \".\",\"-\") AS data_infusione";
    //var qry =   "SELECT  data_infusione";
        qry += " FROM   artrite.infusioni_tcz";
        qry += " WHERE  id_paziente = ?";
    db.query(qry, [req.params.idPaziente], function(err, r, f) {
      if (err) 
        notify_problem(res,qry,err,db);
      

      var vecchie_infusioni       = _(r).pluck('data_infusione').value();
      var infusioni_ricevute      = _(req.body).pluck('data_infusione').value();
          infusioni_ricevute      = _(infusioni_ricevute).filter(isValidDate).value();
          infusioni_ricevute      = _(infusioni_ricevute).uniq().map(function(d) { 
            return moment(d).format('YYYY-MM-DD'); }).value();
      var infusioni_eliminate     = _.difference( vecchie_infusioni, infusioni_ricevute);
      var nuove_infusioni         = _.difference( infusioni_ricevute, vecchie_infusioni);
      

      // --------- allineo il db in parallelo----------
      if(infusioni_eliminate.length > 0) {
        qry = "DELETE from artrite.infusioni_tcz WHERE id_paziente = ? and data_infusione in (?)";
        db.query(qry, [req.params.idPaziente, infusioni_eliminate ], function(err) {
          if (err) notify_problem(res,qry,err,db);
          else if(nuove_infusioni.length === 0)
            db.commit(function(err) {
              if(err) notify_problem(res,'commit',err,db);
              else res.send('ok');
            });
        });
      }

      if(nuove_infusioni.length > 0) {
        qry = "INSERT INTO artrite.infusioni_tcz(id_paziente,data_infusione) VALUES(?,?)";
        var insNuovaInf = function(data_inf) {
          if(data_inf.length === 0) 
            return;

          var d_infusione = data_inf.splice(0,1)[0];
          db.query(qry, [req.params.idPaziente, d_infusione], function(err) {
            if(err) notify_problem(res,qry,err,db);
            if(data_inf.length > 0)
              return insNuovaInf(data_inf);

            // else  
            db.commit(function(err) {
              if(err) notify_problem(res,'commit',err,db);
              else res.send('ok');
            });
          });
        };   
        insNuovaInf(nuove_infusioni);
      }
    });
  });
});

app.post('/data/pazienti/:idPaziente/diagnosimalattia', function(req, res, next) {
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

  function notify_problem(res,qry,what,conn) {
    console.log("errore eseguendo: " + qry);
    console.log(what);
    res.send(500,{err:what}); // TODO.... da sistemare
    if(conn) 
      conn.rollback();
  }

  function getNewConn() {
    
    var mysql_conn = mysql_connector.createConnection();
    mysql_conn.connect();
    return mysql_conn;
  }

  if( req.params.idPaziente === req.body.idPaziente )
    return notify_problem('nel json ricevuto l\'idPaziente non coincide con quello el PUT');

  
   var risposte_usate = _(['fattore_reumatoide','anticorpi'])
     .map(function(a) { return req.body[a];  })
     .uniq().value();
  
  // apertura connessione db
  var mysql_conn = getNewConn();

  // INIZIO metodo normale

  // assumo la connessione come aperta...
  mysql_conn.query('select idtipo_risposta from artrite.tipo_risposta', function(err,r,fields) {
    if(err) notify_problem(res,'select idtipo_risposta from artrite.tipo_risposta',err);

    var risposte_usabili = _.pluck(r,fields[0].name);
    if( _.difference( risposte_usate , risposte_usabili ).length > 0 )
      return notify_problem(res,'select risposta from artrite.tipo_risposta',err);
  });
  mysql_conn.end();
  // FINE metodo normale


  // regola di validità: una diagnosi per paziente?
  var qry  =  'select count(*) as num';
      qry +=  ' , min(iddiagnosi_malattia) as first_id';
      qry +=  ' from artrite.diagnosi_malattia'; 
      qry +=  ' where id_paziente = ?';
  
  mysql_conn = getNewConn();
  mysql_conn.query(qry, [req.params.idPaziente], function(err, r, fields) {
    if(err) notify_problem(res,qry,err);
    var nr_diagnosi = r[0][fields[0].name];
    if( nr_diagnosi > 1 ) {
      return notify_problem(err);
    }
  });
  mysql_conn.end();


  mysql_conn = getNewConn();
  mysql_conn.beginTransaction( function(err) {
    if (err) notify_problem(res,'begin tran',err,mysql_conn);
    qry  =  "SELECT iddiagnosi_malattia";
    qry += " FROM   artrite.diagnosi_malattia";
    qry += " WHERE  id_paziente = ?";
    mysql_conn.query(qry, [req.params.idPaziente], function(err, r, fields) {
      if (err) notify_problem(res,qry,err,mysql_conn);
      if(r.length === 1) {
        var id = r[0][fields[0].name];
        qry  = 'update diagnosi_malattia';
        qry += ' set anticorpi = ?';
        qry += '   , cod_malattia = ?';
        qry += '   , data_diagnosi = ?';
        qry += '   , fattore_reumatoide = ?';
        qry += '   , iddiagnosi_malattia = ?';
        qry += ' where iddiagnosi_malattia = ?';

        mysql_conn.query(qry, [ req.body.anticorpi
                              , req.body.cod_malattia
                              , moment(req.body.data_diagnosi).format('YYYY-MM-DD')
                              , req.body.fattore_reumatoide
                              , req.body.iddiagnosi_malattia
                              , id], function(err, result) {
           if(err) 
            notify_problem(res,qry,err,mysql_conn);

          mysql_conn.commit(function(err) {
            if (err) notify_problem(res,qry,err,mysql_conn);
            else 
              res.send(200, {insertId: result.insertId});
          });
        });
      }
      else {
        
        qry  = 'INSERT INTO diagnosi_malattia';
        qry += ' (anticorpi, cod_malattia, data_diagnosi, fattore_reumatoide, id_paziente)';
        qry += ' VALUES(?, ?, ?, ?, ?)';

        mysql_conn.query(qry, [ req.body.anticorpi
                              , req.body.cod_malattia
                              , req.body.data_diagnosi.substring(0,10)
                              , req.body.fattore_reumatoide
                              , req.params.idPaziente ], function(err, result) {
          if(err) 
            notify_problem(res,qry,err,mysql_conn);

          mysql_conn.commit(function(err) {
            if (err) notify_problem(res,qry,err,mysql_conn);
            else 
              res.send(200, {insertId: result.insertId});
          });
        });
      }
    });
  });
});



//terapie_pre
app.post ('/data/pazienti/:idPaziente/terapie_pre' , function(req, res, next) {
 
  if(req.body.lenght > 0 )
    if( req.params.idPaziente != req.body.id_paziente)
         res.send(500);
    else{ res.send(500);}
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  // query insert 
  var query_ins =  'INSERT INTO artrite.terapia_farmacologica_pre (id_paziente,cod_tipo_farmaco)';
      query_ins += 'VALUES ( ?, ?)';
  
   var fields =  [ req.body.id_paziente , req.body.cod_tipo_farmaco];

 mysql_conn.query(query_ins, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});  
  });
  mysql_conn.end();
});

app.post ('/data/pazienti/:idPaziente/terapie_pre/cancella' , function(req, res, next) {
  if(req.body) {
    if( req.params.idPaziente != req.body.idPaziente)
         res.send(500);
  }
  else{ res.send(500);}

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  // query insert 
  var query_delete ='DELETE FROM artrite.terapia_farmacologica_pre ';
      query_delete += ' WHERE id_paziente= ? and idterapia_farmacologica_pre = ?';
  var fields =  [ req.body.idPaziente,  req.body.idterapia_farmacologica_pre ];

 mysql_conn.query(query_delete, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});  
  });
  mysql_conn.end();
});


app.post ('/data/pazienti/:idPaziente/patologie_concomitanti' , function(req, res, next) {
  if(req.body.lenght > 0 )
    if( req.params.idPaziente != req.body.id_paziente)
         res.send(500);
    else{ res.send(500);}
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  // query insert 
  var query_ins ='INSERT INTO artrite.anamnesi (id_paziente,id_tipo_malattia, descrizione )';
      query_ins += ' VALUES ( ?, ?, ?)';
  
   var fields =  [ req.body.idPaziente , req.body.idtipo_malattia, req.body.descrizione ];

 mysql_conn.query(query_ins, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});  
  });
  mysql_conn.end();
});

app.post ('/data/pazienti/:idPaziente/patologie_concomitanti/cancella' , function(req, res, next) {
  if(req.body) {
    if( req.params.idPaziente != req.body.id_paziente)
         res.send(500);
  }
  else{ res.send(500);}

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  // query insert 
  var query_delete ='DELETE FROM artrite.anamnesi ';
      query_delete += ' WHERE id_paziente= ? and idpatologia_concomitante = ?';
  var fields =  [ req.body.id_paziente,  req.body.idpatologia_concomitante ];

 mysql_conn.query(query_delete, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});  
  });
  mysql_conn.end();
});


app.post ('/data/pazienti/:idPaziente/terapie_concomitanti' , function(req, res, next) {
    if(req.body.lenght > 0 )
      if( req.params.idPaziente != req.body.id_paziente)
         res.send(500);
    else{ res.send(500);}
    // apertura connessione db
    var mysql_conn = mysql_connector.createConnection();
    mysql_conn.connect();
   
    var query =   'DELETE FROM artrite.terapia_concomitante';
        query +=  ' WHERE id_terapia = ? and id_paziente = ?';
    var fields =  [ req.body[0].id_terapia,  req.body[0].id_paziente ];

    //insert 
    var query_ins ='INSERT INTO artrite.terapia_concomitante (id_terapia,id_tipo_farmaco,dose,id_paziente )';
        query_ins += ' VALUES ( ?, ?, ?, ? )';


    function getFieldsIns(r) {
      return [ r.id_terapia, r.id_tipo_farmaco, r.dose,  r.id_paziente ];
    }

    //debugger;
    mysql_conn.beginTransaction(function(err) {
      if (err) { throw err; }
      mysql_conn.query(query, fields, function(err, result) {
        if (err) { 
            mysql_conn.rollback(function() { 
              throw err;
            });
        }

        _.each( req.body, function(r) {
          if(r) {
            console.log(r);
            mysql_conn.query(query_ins, getFieldsIns(r), function(err, result) {
              if (err) { 
                  mysql_conn.rollback(function() { 
                    throw err;
                  });
              }
            });
          }
        });
        
        mysql_conn.commit(function(err) {
          if (err) { 
            mysql_conn.rollback(function() {
              throw err;
            });
          }
        });
        
      });
    });

    //mysql_conn.end();
});


app.post ('/data/pazienti/:idPaziente/terapia_farmaco' , function(req, res, next) {
  if( req.params.idPaziente != req.body.id_paziente)
      res.send(500);
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  
  req.body.data_inizio =   req.body.data_inizio.substring(0,10);
  var query =   'INSERT INTO artrite.terapia (id_paziente, data_inizio)';
      query +=  ' VALUES ( ?, ?)';
  
  var fields =  [ req.body.id_paziente , req.body.data_inizio ];

 mysql_conn.query(query, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});  
  });
  mysql_conn.end();
});

app.put ('/data/pazienti/:idPaziente/terapia_farmaco' , function(req, res, next) {
  if( req.params.idPaziente != req.body.id_paziente)
      res.send(500);
  // apertura connessione db
  //debugger;
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  
  req.body.data_inizio =   req.body.data_inizio.substring(0,10);
  var query  =   'UPDATE artrite.terapia  SET data_inizio = ? where  id_paziente = ? ' ;
  var fields =  [  req.body.data_inizio ,req.body.id_paziente ];

 mysql_conn.query(query, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});  
  });
  mysql_conn.end();
});



app.post('/data/pazienti/:idPaziente/terapia_valutazione/:tempo/cancella' , function(req, res, next) {

  if( req.params.idPaziente != req.body.id_paziente)
    res.send(500);

  if( req.params.tempo != req.body.tempo)
    res.send(500);

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var qry = 'delete from artrite.terapia_valutazione where id_paziente = ? and tempo = ?';
  mysql_conn.query(qry,[req.params.idPaziente, req.params.tempo] , function(err, rows, fields) {
    if (err) throw err;
    res.send(200);    
  });
  mysql_conn.end();
});



app.post('/data/pazienti/:idPaziente/terapia_valutazione' , function(req, res, next) {

    if( req.params.idPaziente === req.body.idPaziente )
    return notify_problem('nel json ricevuto l\'idPaziente non coincide con quello del PUT');

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  // query
  var  query   =   'INSERT INTO artrite.terapia_valutazione( ';
      query   +=  ' id_paziente, art_dolenti, art_tumefatte, pcr, ves, vas_paziente, vas_medico, das28, sdai, cdai, tempo) ';
      query   +=  ' VALUES( ?,    ?,          ?,              ?,  ?,    ?,            ?,          ?,    ?,    ?,    ?    )' ;


  var fields =  [ req.body.id_paziente  ,req.body.art_dolenti, req.body.art_tumefatte
                , req.body.pcr, req.body.ves, req.body.vas_paziente, req.body.vas_medico
                , req.body.das28, req.body.sdai, req.body.cdai, req.body.tempo ];


  mysql_conn.query(query, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});

  });
  mysql_conn.end();
});

app.post('/data/pazienti/pazientenuovo', function(req,res,next){
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  //debugger;
  req.body.datadinascita =   req.body.datadinascita.substring(0,10);
  var query =   'INSERT INTO artrite.paziente (NOME, COGNOME,DATA_NASCITA,CODICE_FISCALE,sesso)';
      query +=  ' VALUES( ?, ?, ?, ? ,? )';
      var fields =  [ req.body.nome, req.body.cognome
                      , req.body.datadinascita, req.body.codicefiscale,req.body.gender];

    mysql_conn.query(query, fields, function(err, result) {
    if(err) throw err;
    res.send(200, {insertId: result.insertId});
  });
  mysql_conn.end();
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
