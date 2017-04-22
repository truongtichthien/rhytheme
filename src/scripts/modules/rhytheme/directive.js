/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function rhythemeDirective() {
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

  rhythemeDirective.$inject = ['$document', '$window', '$timeout', '$compile'];

  ng.module('rhythemeModule')
    .directive('rhytheme', rhythemeDirective);

})(window.angular);