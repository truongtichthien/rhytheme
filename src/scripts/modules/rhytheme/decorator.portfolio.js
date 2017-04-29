/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function PortfolioDecorator() {
    var _vm;

    function _decorate(vm) {
      _vm = vm;

      return {
        init: _initModel
      };
    }

    function _initModel() {
      _vm.portfolio = {};
      _vm.portfolio.title = 'Rhytheme';
      _vm.portfolio.subtitle = 'Do small things with great love';
      _vm.portfolio.browseBtn = 'Browse All';
      _vm.portfolio.filterTag = ['all', 'angularJs', 'html & css'];
      _vm.portfolio.list = [
        {
          name: 'httk',
          icon: 'fa fa-newspaper-o',
          img: '../../../images/graphic-03-thumb11-480x360.jpg'
        },
        {
          name: 'blisk',
          icon: 'glyphicon glyphicon-picture',
          img: '../../../images/graphic-04-thumb11-480x360.jpg'
        },
        {
          name: 'dnn',
          icon: 'glyphicon glyphicon-ok',
          img: '../../../images/graphic-06-thumb11-480x360.jpg'
        },
        {
          name: 'pics',
          icon: 'glyphicon glyphicon-picture',
          img: '../../../images/graphic-04-thumb11-480x360.jpg'
        }
      ];
    }

    return {
      decorate: _decorate
    }
  }

  PortfolioDecorator.$inject = [];

  ng.module('rhythemeModule')
    .factory('portfolioDecorator', PortfolioDecorator);

})(window.angular);