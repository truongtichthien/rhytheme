/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function PortfolioDecorator() {
    var _vm,
      IMG_PATH = 'scripts/app/rhytheme/images/';

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
          name: 'esg',
          icon: 'fa fa-newspaper-o',
          img: IMG_PATH + 'esg-thumb.jpg',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'ESG Infographic Template',
            replacingTpl: 'scripts/app/rhytheme/portfolios/esg.html'
          }
        },
        {
          name: 'blisk',
          icon: 'glyphicon glyphicon-picture',
          img: IMG_PATH + 'graphic-04-thumb11-480x360.jpg',
          tiFullScreen: {
            showButton: false,
            iconClass: 'custom-icon',
            headerTitle: 'HTTK Template',
            replacingTpl: '' //'scripts/app/rhytheme/portfolios/httk.html'
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
            replacingTpl: '' //'scripts/app/rhytheme/portfolios/dnn.html'
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
            replacingTpl: '' //'scripts/app/rhytheme/portfolios/blisk.html'
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