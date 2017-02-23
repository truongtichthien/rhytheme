(function (ng) {
  'use strict';

  function appConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'modules/page1.html',
        controller: 'PageOneCtrl',
        controllerAs: ''
      })
      .when('/ov-full-screen', {
        templateUrl: 'modules/ovFullScreen/ovFullScreen.template.html',
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