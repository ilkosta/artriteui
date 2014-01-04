(function () {
	'use strict';

	var _ = require('lodash');

	var fillqry = function(qry, params) {
		var re = /\?/;
		params = params || [];
		_.each(params, function(p) {
			qry = qry.replace(re, p);
		});
		return qry;
	};

	exports.log = function(res, qry, params) {
		qry = fillqry(qry, params);
		console.log('eseguendo la query: ' + qry);
		console.log('sono stati ritornati: ' + res.length + ' record');
	};

	exports.fillqry = fillqry;
	
}());