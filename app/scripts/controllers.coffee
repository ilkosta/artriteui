'use strict'

### Controllers ###

angular.module('app.controllers', [])

.controller('AppCtrl', [
  '$scope'
  '$location'
  '$resource'
  '$rootScope'

($scope, $location, $resource, $rootScope) ->

  # Uses the url to determine if the selected
  # menu item should have the class active.
  $scope.$location = $location
  $scope.$watch('$location.path()', (path) ->
    $scope.activeNavId = path || '/'
  )

  # getClass compares the current url with the id.
  # If the current url starts with the id it returns 'active'
  # otherwise it will return '' an empty string. E.g.
  #
  #   # current url = '/products/1'
  #   getClass('/products') # returns 'active'
  #   getClass('/orders') # returns ''
  #
  $scope.getClass = (id) ->
    if $scope.activeNavId.substring(0, id.length) == id
      return 'active'
    else
      return ''
])

.controller('MyCtrl1', [
  '$scope'

($scope) ->
  $scope.onePlusOne = 2
])

.controller('MyCtrl2', [
  '$scope'

($scope) ->
  $scope
])

.controller('PazientiElencoCtrl', [
  '$scope','$http'

($scope,$http) ->
  $http.get('data/pazienti.json')
    .success (data) -> 
      $scope.pazienti = data
])



.controller('PazientiNuovoCtrl', [
  '$scope'
($scope) ->
  $scope.master = {}
  $scope.update = (user) ->
    $scope.master = angular.copy(user)
  $scope.reset = ->
    $scope.user = angular.copy($scope.master)
  $scope.reset()
])







