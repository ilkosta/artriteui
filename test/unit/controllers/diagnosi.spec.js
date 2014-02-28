(function() {
	'use strict';

	ddescribe('diagnosi ctrl.', function() {


		var Calendar = (function() {

			function Calendar() {
				// enforces new
				if (!(this instanceof Calendar)) {
					return new Calendar();
				}
				// constructor body
			}

			Calendar.prototype.init = function() {};

			return Calendar;

		}());


		var $scope;
		var ctrl;
		var calObj;


		beforeEach(module('app'));
		beforeEach(module('app.controllers'));
		// beforeEach(module('angular-growl'));
		// beforeEach(module('utils_forms')); // loadDataListIntoScope
		// beforeEach(module('ui.bootstrap')); // $modal


		beforeEach(inject(function(
			$rootScope, $controller, $routeParams, $http
			// $log, 
			// calendar, growl, loadDataListIntoScope, $modal
		) {

			$scope = $rootScope.$new();
			var emptyFn = function() {};
			calObj = new Calendar();

			spyOn(calObj, 'init');

			ctrl = $controller('PazienteDiagnosiEditCtrl', {
				$scope: $scope,
				$routeParams: $routeParams,
				$http: $http,
				$log: emptyFn,
				calendar: function() {
					return calObj;
				},
				growl: emptyFn,
				loadDataListIntoScope: emptyFn,
				$modal: emptyFn
			});
		}));

		it('deve caricare correttamente', function() {

			expect(ctrl).not.toBeNull();
			expect(ctrl).not.toBeUndefined();

		});

		it("deve chiamare calendar().init all'avvio", function() {
			expect(calObj.init).toHaveBeenCalled();
		});

		it('calendar().init deve essere chiamata passandogli lo scope', function() {
			expect(calObj.init).toHaveBeenCalledWith($scope);
		});

		describe('$scope.', function() {
			var scopeFn = ['init', 'add_infusione', 'getTipiRisposta',
			'Cancel',
			'dataDiagnosiValida',
			'inQuestoMese',
			'Save',
			'openInfToDeleteDlg',
			'isUnchanged'
			];

			it('controllo le funzioni che devono essere definite in scope', function() {
				_.each(scopeFn, function(fn) {
					expect($scope[fn]).not.toBeUndefined();
					expect(_.isFunction($scope[fn])).toBe(true);	
				});
				
			});

		});


	});
}());