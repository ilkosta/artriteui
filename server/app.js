
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _    = require('lodash');
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
}

app.get('/', routes.index);
app.get('/users', user.list);

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

// test
app.post('/data/pazienti', function(req, res, next) {
  console.log('ricevuto l\'oggetto:', req);
  res.send({idPaziente: 99});
});

app.get('/data/pazienti/:idPaziente', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // req.params.idPaziente
  // query
    mysql_conn.query('SELECT * from artrite.vpazienti where idPaziente =?', [req.params.idPaziente]  , function(err, rows, fields) {
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


app.put('/data/pazienti/:idPaziente/diagnosimalattia', function(req, res, next) {
  // controllo dei dati ricevuti
  debugger;
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
  function notify_problem(what) {
    res.send(what); // TODO.... da sistemare
  }

  if( req.params.idPaziente === req.body.idPaziente )
    return notify_problem('nel json ricevuto l\'idPaziente non coincide con quello el PUT');

  // controllo delle risposte in tipo_risposta
  // // uso il motodo più pessimistico possibile... utile solo se le risposte fossero tantissime
  // // e quindi lo strumento più adatto a cercare in una collezione sia il db con il suo indiice...
  // // invece in questo caso bastava tirare su l'elenco delle risposte e vedere se c'era...

  
   var risposte_usate = _(['fattore_reumatoide','anticorpi'])
     .map(function(a) { return req.body[a];  })
     .uniq().value();

  // // metodo maniacale...
  // function throw_for_tipo_risposta( risposte , mysql_conn) {
  //   var riposta = _.first(risposte);
  //   mysql_conn.query('select * from tipo_risposta where risposta = ?', 
  //     [riposta], 
  //     function(err, r, fields) {
  //       if(err) throw err;
  //       if(r.lenght !== 1) throw ('trovati più tipi risposta: ' + risposta);
  //   });
  //   throw_for_tipo_risposta(_.tail(risposte));
  // }

  // try {
  //   throw_for_tipo_risposta(risposte_usate, mysql_conn);
  // }
  // catch(err) {
  //   return notify_problem(err);
  // }
  // // FINE metodo maniacale


  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();

  // INIZIO metodo normale

  // assumo la connessione come aperta...
  mysql_conn.query('select risposta from artrite.tipo_risposta', function(err,r,fileds) {
    if(err) throw err;

    var risposte_usabili = _.pluck(r,fields[0]);
    if( _.difference( risposte_usate , risposte_usabili ).length > 0 )
      return notify_problem(err);
  });
  // FINE metodo normale



  // // apertura connessione db
  // var mysql_conn = mysql_connector.createConnection();
  // mysql_conn.connect();

  // // regola di validità: una diagnosi per paziente?
  // var qry =   'select count(*) as num';
  //     qry +=    'min(iddiagnosi_malattia) as first_id';
  //     qry +=  'from diagnosi_malattia'; 
  //     qry +=  'where id_paziente = ?';

  // mysql_conn.query(qry, [req.params.idPaziente], function(err, r, fields) {
  //   var nr_diagnosi = r[0][fields[0]];
  //   if( nr_diagnosi > 1 ) {
  //     console.log("trovati più record diagnosi_malattia per idPaziente = ",req.params.idPaziente);
  //     throw err;
  //   }

  //   qry =   'UPDATE diagnosi_malattia';
  //   qry +=  '';
  //   qry +=  'where iddiagnosi_malattia = ?';
  // });

  mysql_conn.end();
});



app.get('/data/_malattia_ric', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT * FROM artrite.tipo_malattia WHERE COD_TIPO_MALATTIA = \'ric\' ' , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});
app.get('/data/_tipo_risposta', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT * FROM artrite.tipo_risposta'  , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});

app.get('/data/_farmaci_dimard', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT * FROM artrite.tipo_farmaco where tipo_famiglia_farmaco=\'1\' ' , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});

app.get('/data/_farmaci_biologici', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT * FROM artrite.tipo_farmaco where tipo_famiglia_farmaco=\'2\' ' , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});



app.get('/data/pazienti/:idPaziente/terapiepre', function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT * FROM artrite.vterapia_farmacologica_pre where idPaziente =?', [req.params.idPaziente]  , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});
app.get ('/data/_fattori_rischio' , function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('select * from artrite.tipo_malattia where cod_tipo_malattia=\'fdr\'' , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});

app.get ('/data/pazienti/:idPaziente/terapie_concomitanti' , function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT tf.idtipo_farmaco, tf.nome, a.*, ter.id_paziente FROM artrite.tipo_farmaco tf '+
                     ' inner join artrite.terapia_concomitante a on a.id_tipo_farmaco=tf.idtipo_farmaco ' +
                     ' inner join artrite.terapia ter on ter. idterapia = a.id_terapia '+
                     ' where tf.tipo_famiglia_farmaco = \'1\' and ter.id_paziente=?',[req.params.idPaziente] , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
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
   
    var query =   'DELETE FROM artrite.terapia_concomitante ';
        query +=  'WHERE id_terapia = ? and id_paziente = ?'  
    var fields =  [ req.body[0].id_terapia,  req.body[0].id_paziente ];

    //insert 
    var query_ins ='INSERT INTO artrite.terapia_concomitante (id_terapia,id_tipo_farmaco,dose,id_paziente )';
        query_ins += 'VALUES ( ?, ?, ?, ? )';


    function getFieldsIns(r) {
      return [ r.id_terapia, r.id_tipo_farmaco, r.dose,  r.id_paziente ];
    }

    debugger;
    mysql_conn.beginTransaction(function(err) {
      if (err) { throw err; }
      mysql_conn.query(query, fields, function(err, result) {
        if (err) { 
            mysql_conn.rollback(function() { 
              throw err;
            });
        }

        _.each( req.body, function(r) {
          if(r)
            mysql_conn.query(query_ins, getFieldsIns(r), function(err, result) {
              if (err) { 
                  mysql_conn.rollback(function() { 
                    throw err;
                  });
              }
            });
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



app.get ('/data/pazienti/:idPaziente/terapia_farmaco' , function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
  debugger;
    mysql_conn.query('select idterapia, id_paziente, data_inizio from artrite.terapia where id_paziente =?', [req.params.idPaziente]  
                , function(err, rows, fields) {
        if (err) throw err;
        res.send(rows);    
  });
  mysql_conn.end();
});

app.post ('/data/pazienti/:idPaziente/terapia_farmaco' , function(req, res, next) {
  if( req.params.idPaziente != req.body.id_paziente)
      res.send(500);
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  
  req.body.data_inizio =   req.body.data_inizio.substring(0,10);
  var query =   'INSERT INTO artrite.terapia (id_paziente, data_inizio)';
      query +=  'VALUES ( ?, ?)'  
  
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
  debugger;
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


app.get ('/data/pazienti/:idPaziente/terapia_valutazione' , function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  
  // query
    mysql_conn.query('SELECT tv.* FROM artrite.terapia_valutazione tv '+
                     ' where tv.id_paziente=?',[req.params.idPaziente] , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});

app.post('/data/pazienti/:idPaziente/terapia_valutazione/:tempo/cancella' , function(req, res, next) {

  if( req.params.idPaziente !== req.body.id_paziente)
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
  console.log(req.body);

  
    if( req.params.idPaziente === req.body.idPaziente )
    return notify_problem('nel json ricevuto l\'idPaziente non coincide con quello el PUT');

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
  debugger;
  req.body.datadinascita =   req.body.datadinascita.substring(0,10);
  var query =   'INSERT INTO artrite.paziente (NOME, COGNOME,DATA_NASCITA,CODICE_FISCALE,sesso)';
      query +=  'VALUES( ?, ?, ?, ? ,? )';
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
