
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var _    = require('lodash');
var moment = require('moment');



var date_utils = require('./utils/date.js');
var notify_problem = require('./utils/problem_notifier.js').notify_problem;

// personal libs
var mysql_connector = require('./db/config.js');
var dev_env = require('./environments/dev.js');

// rotte
var routes = require('./routes')
  , diagnosi = require('./routes/diagnosi.js')
  , infusioni = require('./routes/infusioni.js')
  ;

var app = express();

dev_env.configure_env(app);

require('./routes/get.js').add_simple_get(app);


// diagnosi
app.get('/data/pazienti/:idPaziente/diagnosimalattia', diagnosi.get );
app.post('/data/pazienti/:idPaziente/diagnosimalattia', diagnosi.set);

// infusioni
app.post('/data/pazienti/:idPaziente/infusioni/tcz/aggiungi', infusioni.ins);
app.post('/data/pazienti/:idPaziente/infusioni/tcz/cancella', infusioni.del);


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
    if(err) 
      notify_problem(res,query_ins,err,fields);
    else
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
    if(err) 
      notify_problem(res,query_delete,fields,params);
    
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
    if(err) 
      notify_problem(res,query_ins,err,fields);

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
    if(err) 
      notify_problem(res,query_delete,err,fields);
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
      if (err) 
        notify_problem(res,"begin beginTransaction",err,[],conn);

      mysql_conn.query(query, fields, function(err, result) {
        if (err) 
          notify_problem(res,query,err,fields,conn);

        _.each( req.body, function(r) {
          if(r) {
            console.log(r);
            mysql_conn.query(query_ins, getFieldsIns(r), function(err, result) {
              if (err) 
                notify_problem(res,query_ins,err,getFieldsIns(r),conn);
            });
          }
        });
        
        mysql_conn.commit(function(err) {
          if (err) 
            notify_problem(res,"durante il commit",err,[],conn);
        });
        
      });
    });
});


app.post ('/data/pazienti/:idPaziente/terapia_farmaco' , function(req, res, next) {
  if( req.params.idPaziente != req.body.id_paziente)
      res.send(500);
  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  
  var query =   'INSERT INTO artrite.terapia (id_paziente, data_inizio)';
      query +=  ' VALUES ( ?, ?)';
  
  var fields =  [ req.body.id_paziente , moment(req.body.data_inizio).format('YYYY-MM-DD')];

 mysql_conn.query(query, fields, function(err, result) {
    if(err) 
      notify_problem(res,query,err,fields);

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
  
  var query  =   'UPDATE artrite.terapia  SET data_inizio = ? where  id_paziente = ? ' ;
  var fields =  [  moment(req.body.data_inizio).format('YYYY-MM-DD'),req.body.id_paziente ];

 mysql_conn.query(query, fields, function(err, result) {
    if(err) 
      notify_problem(res,query,err,fields);

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
  var params = [req.params.idPaziente, req.params.tempo];
  mysql_conn.query(qry,params , function(err, rows, fields) {
    if (err) 
      notify_problem(res,qry,err,params);
    res.send(200);    
  });
  mysql_conn.end();
});



app.post('/data/pazienti/:idPaziente/terapia_valutazione' , function(req, res, next) {

    if( req.params.idPaziente === req.body.idPaziente )
    return notify_problem(res, 'nel json ricevuto l\'idPaziente non coincide con quello del PUT');

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
    if(err) 
      notify_problem(res,query,err,fields);

    res.send(200, {insertId: result.insertId});
  });
  mysql_conn.end();
});

app.post('/data/pazienti/pazientenuovo', function(req,res,next){
  // acluni controlli
  if(!date_utils.isDateInRange(req.body.datadinascita, moment().subtract('years',100)))
    notify_problem(res,"chek input: data inizio = ?","data di inizio non valida",[req.body.datadinascita]);

  // apertura connessione db
  var mysql_conn = mysql_connector.createConnection();
  mysql_conn.connect();
  //debugger;
  var query =   'INSERT INTO artrite.paziente (NOME, COGNOME,DATA_NASCITA,CODICE_FISCALE,sesso)';
      query +=  ' VALUES( ?, ?, ?, ? ,? )';
      var fields =  [ req.body.nome, req.body.cognome
                    , moment(req.body.datadinascita).format('YYYY-MM-DD')
                    , req.body.codicefiscale,req.body.gender
                    ];

    mysql_conn.query(query, fields, function(err, result) {
    if(err) 
      notify_problem(res,query,err,fields);

    res.send(200, {insertId: result.insertId});
  });
  mysql_conn.end();
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
