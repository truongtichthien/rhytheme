/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function DemoController() {
    var vm = this;
    vm.test = 'abc';
  }

  DemoController.$inject = [];

  ng.module('demoModule')
    .controller('DemoController', DemoController);

})(window.angular, window._);