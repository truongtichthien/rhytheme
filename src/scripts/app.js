//noinspection JSUnresolvedVariable
(function (ng) {
  'use strict';

  function appConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'scripts/modules/page1.html',
        controller: 'PageOneCtrl',
        controllerAs: ''
      })
      .when('/ov-full-screen', {
        templateUrl: 'scripts/modules/ovFullScreenDemo/ovFullScreenDemo.template.html',
        controller: 'OvFullScreenCtrl',
        controllerAs: 'ov'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  appConfig.$inject = ['$routeProvider'];

  ng.module('sampleApp', ['ngRoute'])
    .config(appConfig);
})(angular);