/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function RhythemeController() {
    var vm = this;

    vm.currentTemplate = 'scripts/modules/rhytheme/view.portfolio.html';
  }

  RhythemeController.$inject = [];

  ng.module('rhythemeModule')
    .controller('RhythemeController', RhythemeController);

})(window.angular);