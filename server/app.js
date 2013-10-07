
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

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
  var pazienti;
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

app.get ('/data/pazienti/:idPaziente/terapia_farmaco' , function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('select idterapia, id_paziente, data_inizio from artrite.terapia where id_paziente =?', [req.params.idPaziente]  , function(err, rows, fields) {
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

app.get ('/data/pazienti/:idPaziente/terapia_valutazione' , function(req, res, next) {
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  var pazienti;
  // query
    mysql_conn.query('SELECT tv.* FROM artrite.terapia_valutazione tv '+
                     ' where tv.id_paziente=?',[req.params.idPaziente] , function(err, rows, fields) {
    if (err) throw err;
    res.send(rows);    
  });
  mysql_conn.end();
});




http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
