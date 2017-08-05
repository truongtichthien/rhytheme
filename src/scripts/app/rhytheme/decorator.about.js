/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function AboutDecorator() {
    var _vm;

    function _decorate(vm) {
      _vm = vm;

      return {
        init: _initModel
      };
    }

    function _initModel() {
      _vm.about = {};
      _vm.about.title = 'About Me';
      _vm.about.subtitle = 'If you can dream it, you can do it';
    }

    return {
      decorate: _decorate
    }
  }

  AboutDecorator.$inject = [];

  ng.module('rhythemeModule')
    .factory('aboutDecorator', AboutDecorator);

})(window.angular);