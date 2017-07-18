/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function demoConfig($route) {
    $route
      .when('/', {
        templateUrl: 'scripts/modules/demo/view.home.html'
      })
      .when('/home', {
        templateUrl: 'scripts/modules/demo/view.home.html'
      })
      .when('/full-screen', {
        templateUrl: 'scripts/modules/demo/ti-full-screen-demo/view.html'
      })
      .when('/tree-view', {
        templateUrl: 'scripts/modules/demo/ti-tree-view-demo/view.html',
        controller: 'TiTreeViewDemoController',
        controllerAs: 'ti'
      })
      .otherwise({ redirectTo: '/' });
  }

  demoConfig.$inject = ['$routeProvider'];

  ng.module('demoModule', [
    'ngRoute',
    'ngAnimate',
    'tiComponentsModule'
  ])
    .config(demoConfig);

})(window.angular);