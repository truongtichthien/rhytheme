(function (ng) {
  'use strict';

  function appConfig($routeProvider) {
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
  }

  appConfig.$inject = ['$routeProvider'];

  ng.module('sampleApp', ['ngRoute'])
    .config(appConfig);
})(angular);