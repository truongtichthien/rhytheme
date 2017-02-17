(function (ng) {
  'use strict';

  function appConfig($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '',
        controller: '',
        controllerAs: ''
      })
      .when('', {
        templateUrl: '',
        controller: '',
        controllerAs: ''
      })
      .otherwise({
        redirectTo: '/'
      });

    // $locationProvider.html5Mode(true)
  }

  appConfig.$inject = ['$routeProvider', '$locationProvider'];

  ng.module('sampleApp', ['ngRoute'])
    .config(appConfig);
})(angular);