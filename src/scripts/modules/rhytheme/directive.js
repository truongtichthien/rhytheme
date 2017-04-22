/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function rhythemeModule() {
    var directive;

    directive = {
      restrict: 'EA',
      templateUrl: 'scripts/modules/rhytheme/directive.html'
    };

    return directive;
  }

  rhythemeModule.$inject = ['$document', '$window', '$timeout', '$compile'];

  ng.module('rhythemeModule')
    .directive('rhythemeModule', rhythemeModule);

})(window.angular);