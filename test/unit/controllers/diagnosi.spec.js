

(function() {
	'use strict';

	ddescribe('diagnosi ctrl.', function() {

		var $scope;
		var ctrl;
		var calObj;


		beforeEach(module('app'));
		beforeEach(module('app.controllers'));


		beforeEach(inject(function(
			$rootScope, $controller, $routeParams, $http) {

			$scope = $rootScope.$new();
			var emptyFn = function() {};
			calObj = getCalMock();
                
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
		
    describe('utilizzo di calendar', function() {
    	beforeEach(function() {
    		//calObj = new Calendar();
    		//spyOn(calObj, 'init');
    	});
    	
    	it("deve chiamare calendar().init all'avvio", function() {
    		expect(calObj.init).toHaveBeenCalled();
    	});

    	it('calendar().init deve essere chiamata passandogli lo scope', function() {
    		expect(calObj.init).toHaveBeenCalledWith($scope);
    	});
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

			describe('Cancel', function() {
				it('deve ripristinare lo $scope iniziale', function() {});
			});

			describe('dataDiagnosiValida', function() {
            describe('con data formattata male deve tornare false', function() {
            });
				it('non deve accettare date più vecchie di 10 anni', function() {});
				it('non deve accettare date nel futuro', function() {});
			});

			describe('inQuestoMese', function() {
                describe('con data formattata male deve tornare false', function() {
                });
				it('non deve accettare date più vecchie di 30gg', function() {});
				it('non deve accettare date nel futuro', function() {});
			});

			describe('isUnchanged', function() {
				describe('dice se il parametro passato (diagnosi) è identico a $scope.master', function() {

					var diagnosi;

					beforeEach(function() {
						$scope.master = {
							foo: true,
							foo2: {},
							foo3: [1, 2, 3]
						};
						diagnosi = angular.copy($scope.master);
					});

					it('se $scope.master e diagnosi sono identici, deve tornare true', function() {
						expect($scope.isUnchanged(diagnosi)).toEqual(true);

					});

					it('se $scope.master e diagnosi differiscono solo per delle funzioni ma non per le proprietà, deve tornare true', function() {
						diagnosi.fn = function() {};
						expect($scope.isUnchanged(diagnosi)).toEqual(true);
					});


					it('se $scope.master e diagnosi differiscono per i valori delle proprietà, che tra i due oggetti sono identiche, deve tornare false', function() {
						diagnosi.foo = [1, 2, 3];
						expect($scope.isUnchanged(diagnosi)).toEqual(false);
					});

					it('se $scope.master e diagnosi differiscono per delle proprietà, nel senso che uno dei due ha delle proprietà in più dell\'altro, deve tornare false', function() {
						diagnosi.diff = [1, 2, 3];
						expect($scope.isUnchanged(diagnosi)).toEqual(false);
					});



				});
			});
			describe('add_infusione', function() {});
			describe('getTipiRisposta', function() {});

		});


	});
}());
