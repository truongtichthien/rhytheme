/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function httkAppDirective() {
    var directive;

    directive = {
      restrict: 'EA',
      templateUrl: 'scripts/modules/httk/view.html'
    };

    return directive;
  }

  httkAppDirective.$inject = [];

  ng.module('httkModule')
    .directive('httkApp', httkAppDirective);

})(window.angular);