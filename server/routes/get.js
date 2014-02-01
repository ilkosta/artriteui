(function() {
  'use strict';

  var _ = require('lodash')
    , mysql_connector = require('../db/config.js')
    , notify_problem = require('../utils/problem_notifier.js').notify_problem    
    , qryLogger = require('../utils/qry_logger.js')
    ;



  exports.add_simple_get = function(app) {

    var simple_params = [{
      nome_parametro: 'pazienti',
      qry: 'SELECT * from artrite.vpazienti'
    }, {
      nome_parametro: '_tipo_risposta',
      qry: 'SELECT * FROM artrite.tipo_risposta'
    }, {
      nome_parametro: '_farmaci_dimard',
      qry: 'SELECT * FROM artrite.tipo_farmaco where tipo_famiglia_farmaco=\'1\' or tipo_famiglia_farmaco=\'3\''
    }, {
      nome_parametro: '_farmaci_biologici',
      qry: 'SELECT * FROM artrite.tipo_farmaco where tipo_famiglia_farmaco=\'2\''
    }, {
      nome_parametro: '_malattia_ric',
      qry: 'SELECT * FROM artrite.tipo_malattia where cod_tipo_malattia=\'ric\''
    }, {
      nome_parametro: '_malattia_ptc',
      qry: 'SELECT * FROM artrite.tipo_malattia where cod_tipo_malattia=\'ptc\''
    }, {
      nome_parametro: '_fattori_rischio',
      qry: 'select * from artrite.tipo_malattia where cod_tipo_malattia=\'fdr\''
    }, {
      nome_parametro: '_cod_tipo_sospensione',
      qry: 'select * from cod_tipo_sospensione'
    }, {
      nome_parametro: '_tipo_sospensione',
      qry: 'select * from vsospensione'
    }, {
      nome_parametro: '_tipo_sospensione_dimard',
      qry: 'select * from tipo_sospensione where tipo_famiglia_farmaco = 1'
    }];

    var add_get = function(param) {
      // inject the route
      app.get('/data/' + param.nome_parametro, function(req, res, next) {
        // apertura connessione db
        var mysql_conn = mysql_connector.createConnection();
        mysql_conn.connect();
        var pazienti;
        // query
        mysql_conn.query(param.qry, function(err, rows, fields) {
          if (err)
            notify_problem(res, param.qry, err);
          qryLogger.log(rows, param.qry);
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
        // query
        mysql_conn.query(param.qry, [req.params.idPaziente], function(err, rows, fields) {
          if (err)
            notify_problem(res, param.qry, err, [req.params.idPaziente]);
          
          qryLogger.log(rows, param.qry, [req.params.idPaziente]);
          res.send(rows);
        });
        mysql_conn.end();
      });
    };

    var qry_paziente = [{
        nome_parametro: '',
        qry: 'SELECT * from artrite.vpazienti where idPaziente =?'
      }, {
        nome_parametro: 'infusioni/tcz',
        qry: 'SELECT data_infusione from artrite.infusioni_tcz where id_paziente =? order by data_infusione desc'
      }, {
        nome_parametro: 'terapie_pre',
        qry: 'SELECT * FROM artrite.vterapia_farmacologica_pre where idPaziente =?'
      }, {
        nome_parametro: 'fattori_di_rischio',
        qry: 'SELECT a.*, t.descrizione as tipo_malattia FROM artrite.anamnesi a inner join artrite.tipo_malattia t on a.id_tipo_malattia= t.idtipo_malattia where t.cod_tipo_malattia = \'fdr\' and  a.id_paziente=?'
      }, {
        nome_parametro: 'patologie_concomitanti',
        qry: 'SELECT a.*, t.descrizione as tipo_malattia FROM artrite.anamnesi a inner join artrite.tipo_malattia t on a.id_tipo_malattia= t.idtipo_malattia where t.cod_tipo_malattia = \'ptc\' and  a.id_paziente=?'
      }, {
        nome_parametro: 'patologie_concomitanti',
        qry: 'SELECT a.*, t.descrizione as tipo_malattia FROM artrite.anamnesi a inner join artrite.tipo_malattia t on a.id_tipo_malattia= t.idtipo_malattia where t.cod_tipo_malattia = \'ptc\' and  a.id_paziente=?'
      }, {
        nome_parametro: 'terapie_concomitanti',
        qry:  'SELECT ' +
              '  tf.idtipo_farmaco, tf.nome, ' +
              '  tc.*, ter.id_paziente, ts.descrizione as motivo_sospensione ' +
              'FROM artrite.tipo_farmaco tf ' +
              'join artrite.terapia_concomitante tc on tc.id_tipo_farmaco=tf.idtipo_farmaco ' +
              'join artrite.terapia ter on ter.idterapia = tc.id_terapia ' +
              'left join tipo_sospensione ts on ts.idtipo_motivo_sospensione = tc.idtipo_motivo_sospensione ' +
              'where tf.tipo_famiglia_farmaco = \'1\' ' + // dmard
              '  and ter.id_paziente=?'
      },

      {
        nome_parametro: 'terapia_farmaco',
        qry: 'select * from artrite.terapia where id_paziente =?'
      }, {
        nome_parametro: 'terapia_valutazione',
        qry: 'SELECT tv.* FROM artrite.terapia_valutazione tv where tv.id_paziente=? order by tv.tempo'
      }, {
        nome_parametro: 'sospensioni',
        qry: 'select  tersosp.idterapia_sospensione' +
          '     ,   tersosp.id_terapia' +
          '     ,   tersosp.tipo_sospensione as cod_tipo_sospensione' +
          '     ,   cts.descrizione as tipo_sospensione' +
          '     ,   tersosp.id_sospensione' +
          '     ,   ts.descrizione as sospensione' +
          '     ,   tersosp.id_sospensione_dettaglio' +
          '     ,   tsd.sospensione_dettaglio as dettaglio' +
          '     ,   tersosp.data_inizio' +
          '     ,   tersosp.data_fine' +
          '     ,   tersosp.note' +
          '     ,   tersosp.num_infusioni_fatte' +
          '     ,   tersosp.follow_up' +
          ' from terapia_sospensione as tersosp' +
          ' join terapia t on tersosp.id_terapia = t.idterapia' +
          ' left join cod_tipo_sospensione cts on tersosp.tipo_sospensione = cts.cod_tipo_sospensione' +
          ' join tipo_sospensione ts on tersosp.id_sospensione = ts.idtipo_motivo_sospensione' +
          ' left join tipo_sospensione_dettaglio tsd ' +
          '     on tersosp.id_sospensione_dettaglio = tsd.id_sospensione_dettaglio' +
          '     and tersosp.id_sospensione = tsd.id_tipo_sospensione' +
          ' where t.id_paziente = ?'
      }, {
        nome_parametro: 'paziente_modifica',
        qry: 'select  * from paziente ' +
             ' where idPaziente = ?'
      },{
        nome_parametro: 'sospensioni_tempo',
        qry: 'select  * from paziente ' +
             ' where idPaziente = ?'
      }

    ];

    _.each(qry_paziente, add_paziente_simple_get);
  };
}());