(function () {
	'use strict';

var _ = require('lodash');
	var moment = require('moment');
	var date_utils = require('../utils/date.js');
	var mysql_connector = require('../db/config.js');
	var notify_problem = require('../utils/problem_notifier.js').notify_problem;


	exports.ins = function(req, res, next) {
		if (req.body.lenght === 0) {
			res.send(500);
			return;
		}

		var idPazienteOk = function() {
			var id_pazienti = _(req.body).pluck('id_paziente').unique().value();
			if(id_pazienti.length !== 1)
				return false;
			if(req.params.idPaziente != id_pazienti[0])
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
   
    var qryDel =   'DELETE FROM artrite.terapia_concomitante';
        qryDel +=  ' WHERE id_terapia = ? and id_paziente = ?';
    var fields =  [ req.body[0].id_terapia,  req.body[0].id_paziente ];

    //insert 
    var qryIns ='INSERT INTO artrite.terapia_concomitante (id_terapia,id_tipo_farmaco,dose,id_paziente )';
        qryIns += ' VALUES ( ?, ?, ?, ? )';


    var getFieldsIns = function(r) {
      return [ r.id_terapia, r.id_tipo_farmaco, r.dose,  r.id_paziente ];
    };
    
    mysql_conn.beginTransaction(function(err) {
      if (err) 
        notify_problem(res,"begin beginTransaction",err,[],mysql_conn);

      mysql_conn.query(qryDel, fields, function(err, result) {
        if (err) 
          notify_problem(res,qryDel,err,fields,mysql_conn);

        _.each( req.body, function(r) {
          if(r) {
            console.log(r);
            mysql_conn.query(qryIns, getFieldsIns(r), function(err, result) {
              if (err) 
                notify_problem(res,qryIns,err,getFieldsIns(r),mysql_conn);
            });
          }
        });
        
        mysql_conn.commit(function(err) {
          if (err) 
            notify_problem(res,"durante il commit",err,[],mysql_conn);
        });
        
      });
    });
};
	
}());