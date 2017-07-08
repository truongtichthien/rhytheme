/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function rhythemeAppDirective() {
    var directive;

    directive = {
      restrict: 'EA',
      scope: {},
      controller: 'RhythemeController',
      controllerAs: 'rhytheme',
      link: function (scope, element) {
        element.ready(function () {
          scope.$apply(function () {
            console.log('module ready');
          });
        });
      },
      templateUrl: 'scripts/modules/rhytheme/view.html'
    };

    return directive;
  }

  rhythemeAppDirective.$inject = [];

  ng.module('rhythemeModule')
    .directive('rhythemeApp', rhythemeAppDirective);

})(window.angular);