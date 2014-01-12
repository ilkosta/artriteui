
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var _    = require('lodash');
var moment = require('moment');

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

// paziente modifica
var paziente_mod = require('./routes/paziente_modifica.js');
app.post('/data/pazienti/:idPaziente/paziente_modifica', paziente_mod.upd);

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

// sospensioni
var sospensioni = require('./routes/sospensioni.js');
app.post('/data/pazienti/:idPaziente/sospensioni/:idterapia_sospensione/aggiorna', sospensioni.upd);
app.post('/data/pazienti/:idPaziente/sospensioni/:idterapia_sospensione/cancella', sospensioni.del);  
app.post('/data/pazienti/:idPaziente/sospensioni/inserisci', sospensioni.ins);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
