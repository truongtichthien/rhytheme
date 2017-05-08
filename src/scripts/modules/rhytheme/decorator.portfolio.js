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
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'HTTK Template',
            replacedTpl: 'scripts/modules/rhytheme/portfolios/httk.html'
          }
        },
        {
          name: 'blisk',
          icon: 'glyphicon glyphicon-picture',
          img: IMG_PATH + 'graphic-04-thumb11-480x360.jpg',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'Pics Template',
            replacedTpl: 'scripts/modules/rhytheme/portfolios/pics.html'
          }
        },
        {
          name: 'dnn',
          icon: 'glyphicon glyphicon-ok',
          img: IMG_PATH + 'graphic-06-thumb11-480x360.jpg',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'DNN Template',
            replacedTpl: 'scripts/modules/rhytheme/portfolios/dnn.html'
          }
        },
        {
          name: 'pics',
          icon: 'glyphicon glyphicon-picture',
          img: IMG_PATH + 'graphic-04-thumb11-480x360.jpg',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'Blisk Template',
            replacedTpl: 'scripts/modules/rhytheme/portfolios/blisk.html'
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