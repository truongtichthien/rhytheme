/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function PortfolioDecorator($timeout, $interval) {
    let _vm = {};
    const TIME_OUT = 5;
    const IMG_PATH = 'images/portfolio/';

    function onMouseEnter(item /*evt*/) {
      item.counter = 0;
      $interval.cancel(item.stopCounting);
    }

    function onMouseLeave(item, evt) {
      if (item.showDetail) {
        item.stopCounting = $interval(function () {
          if (++item.counter === TIME_OUT) {
            item.showDetail = false;
            onMouseEnter(item, evt);
          }
        }, 1000);
      }
    }

    function _initModel() {
      _vm.portfolio = {};
      _vm.portfolio.title = 'Rhytheme';
      _vm.portfolio.subtitle = 'Do small things with great love';
      _vm.portfolio.browseBtn = 'Browse All';
      _vm.portfolio.filterTag = ['all', 'html-css', 'angular', 'react'];

      var portfolioItem = [
        {name: 'supper', tag: 'angular'},
        {name: 'heartbeat', tag: 'angular'},
        {name: 'blisk', tag: 'html-css'},
        {name: 'esg', tag: 'html-css'},
        {name: 'dnn', tag: 'html-css'},
        {name: 'httk', tag: 'html-css'}
      ];

      _vm.portfolio.list = _.each(portfolioItem, function (p) {
        p.thumbnail = IMG_PATH + 'thumb-' + p.name + '.jpg';
        p.icon = IMG_PATH + 'icon-' + p.tag + '.png';
        p.demo = 'https://rhytheme-' + p.name + '.herokuapp.com/';
        return p;
      });

      _vm.portfolio.onLoadFunction = function () {
        $timeout(function () {
          // console.log('loaded');
        });
      };

      _vm.portfolio.onMouseEnter = onMouseEnter;
      _vm.portfolio.onMouseLeave = onMouseLeave;
    }

    function _decorate(vm) {
      _vm = vm;

      return {
        init: _initModel
      };
    }

    return {
      decorate: _decorate
    };
  }

  PortfolioDecorator.$inject = ['$timeout', '$interval'];

  ng.module('rhythemeModule')
    .factory('portfolioDecorator', PortfolioDecorator);

})(window.angular, window._);
