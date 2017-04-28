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
      templateUrl: 'scripts/modules/rhytheme/view.html'
    };

    return directive;
  }

  rhythemeAppDirective.$inject = ['$document', '$window', '$timeout', '$compile'];

  ng.module('rhythemeModule')
    .directive('rhythemeApp', rhythemeAppDirective);

})(window.angular);