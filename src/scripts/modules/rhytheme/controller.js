/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function RhythemeController() {
    /** variable definition */
    var vm = this,
      template = {
        portfolio: 'scripts/modules/rhytheme/view.portfolio.html',
        about: 'scripts/modules/rhytheme/view.about.html'
      };

    /** variable binding */
    vm.currentTemplate = '';
    vm.switchView = _switchView;

    /** function execution */
    vm.switchView('portfolio');

    /** function definition */
    function _switchView(tpl) {
      vm.currentTemplate = template[tpl];
    }
  }

  RhythemeController.$inject = [];

  ng.module('rhythemeModule')
    .controller('RhythemeController', RhythemeController);

})(window.angular);