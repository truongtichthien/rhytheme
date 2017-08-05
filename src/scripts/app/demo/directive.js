/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function demoAppDirective() {
    var directive;

    directive = {
      restrict: 'EA',
      scope: {},
      controller: 'DemoController',
      controllerAs: 'demo',
      link: function (scope, element) {
        element.ready(function () {
          scope.$apply(function () {
            console.log('Demo is ready');
          });
        });
      },
      templateUrl: 'scripts/app/demo/view.html'
    };

    return directive;
  }

  demoAppDirective.$inject = [];

  ng.module('demoModule')
    .directive('demoApp', demoAppDirective);

})(window.angular);