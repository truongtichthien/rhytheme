/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function PortfolioDecorator() {
    var _vm,
      IMG_PATH = 'scripts/modules/rhytheme/images/';

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
      //todo refactor portfolio list
      _vm.portfolio.list = [
        {
          name: 'httk',
          icon: 'fa fa-newspaper-o',
          img: IMG_PATH + 'httk-thumb.jpg',
          replacedTpl: 'scripts/modules/rhytheme/portfolios/httk.html',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'tiFull-screen Component by Thien Truong'
          }
        },
        {
          name: 'blisk',
          icon: 'glyphicon glyphicon-picture',
          img: IMG_PATH + 'graphic-04-thumb11-480x360.jpg',
          replacedTpl: 'scripts/modules/httk/app.html',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'tiFull-screen Component by Thien Truong'
          }
        },
        {
          name: 'dnn',
          icon: 'glyphicon glyphicon-ok',
          img: IMG_PATH + 'graphic-06-thumb11-480x360.jpg',
          replacedTpl: 'scripts/modules/httk/app.html',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'tiFull-screen Component by Thien Truong'
          }
        },
        {
          name: 'pics',
          icon: 'glyphicon glyphicon-picture',
          img: IMG_PATH + 'graphic-04-thumb11-480x360.jpg',
          replacedTpl: 'scripts/modules/httk/app.html',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'tiFull-screen Component by Thien Truong'
          }
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