(function() {
	'use strict';
	
	var path = require('path');

	var express = require('express');
	var expressWinston = require("express-winston");
	var winston = require("winston");


	exports.configure_env = function(app) {
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'jade');
		app.use(express.favicon());
		app.use(express.logger('dev'));
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(app.router);
		app.use(expressWinston.errorLogger({
			transports: [
				new winston.transports.Console({
					json: true,
					colorize: true
				})
			],
			//level: "inf",
			meta: true, // optional: control whether you want to log the meta data about the request (default to true)
			msg: "HTTP {{req.method}} {{req.url}}" // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
		}));


		app.use(express.static(path.join(__dirname, '..' , 'public')));

		// development only
		if ('development' == app.get('env')) {
			app.use(express.errorHandler());
			app.enable('log actions');
			app.enable('env info');
			app.use(require('express').errorHandler({
				dumpExceptions: true,
				showStack: true
			}));
		}

		// gestione degli errori
		function logErrors(err, req, res, next) {
			console.error(err.stack);
			res.send(500, 'Something broke!');
			next(err);
		}

		function clientErrorHandler(err, req, res, next) {
			if (req.xhr) {
				res.send(500, {
					error: 'Something blew up!'
				});
			} else {
				next(err);
			}
		}

		function errorHandler(err, req, res, next) {
			res.status(500);
			res.render('error', {
				error: err
			});
		}
		app.use(logErrors);
		app.use(clientErrorHandler);
		app.use(errorHandler);
	};

}());