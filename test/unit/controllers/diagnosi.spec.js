(function() {
	'use strict';

	describe('diagnosi ctrl.', function() {

		
		var Calendar = (function() {
		
			function Calendar() {
				// enforces new
				if (!(this instanceof Calendar)) {
					return new Calendar();
				}
				// constructor body
			}
		
			Calendar.prototype.init = function() {
				// method body
			};
		
			return Calendar;
		
		}());


		var $scope;
		var ctrl;
		

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
			ctrl = $controller('PazienteDiagnosiEditCtrl', {
				$scope: $scope,
				$routeParams: $routeParams,
				$http: $http,
				$log: emptyFn,
				calendar: function(){return new Calendar();},
				growl: emptyFn,
				loadDataListIntoScope: emptyFn,
				$modal: emptyFn
			});
		}));

		it('deve caricare correttamente', function() {

			expect(ctrl).not.toBe(null);
			expect(ctrl).not.toBe(undefined);

		});
	});
}());