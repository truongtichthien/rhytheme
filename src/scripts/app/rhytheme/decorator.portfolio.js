/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function PortfolioDecorator($timeout, $interval) {
    var _vm = {};
    var TIME_OUT = 5;
    var IMG_PATH = 'images/portfolio/';

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

    function onFilter(tag) {
      console.log(tag);
      _vm.portfolio.filteredBy = tag;
    }

    function _initModel() {
      _vm.portfolio = {};
      _vm.portfolio.title = 'Rhytheme';
      _vm.portfolio.subtitle = 'Do small things with great love';
      _vm.portfolio.browseBtn = 'Browse All';
      _vm.portfolio.filterTag = ['', 'html-css', 'angular', 'react'];
      _vm.portfolio.filteredBy = '';

      var portfolioItem = [
        {
          name: 'adi', tag: 'react', responsive: true,
          detail: ['ReactJS | React Hooks | Redux', 'MariaDB'],
          url: 'https://ad-i.com'
        },
        {
          name: 'supper', tag: 'angular', responsive: false,
          detail: ['AngularJS', 'ExpressJS | Heroku', 'MongoDB', 'Live-update | Server-Sent Events']
        },
        {
          name: 'heartbeat', tag: 'angular', responsive: false,
          detail: ['AngularJS', 'ExpressJS | Heroku', 'MongoDB']
        },
        {
          name: 'blisk', tag: 'html-css', responsive: true,
          detail: ['HTML/CSS', 'ExpressJS | Heroku']
        },
        {
          name: 'esg', tag: 'html-css', responsive: true,
          detail: ['HTML/CSS', 'ExpressJS | Heroku']
        },
        {
          name: 'dnn', tag: 'html-css', responsive: true,
          detail: ['HTML/CSS', 'ExpressJS | Heroku']
        },
        {
          name: 'httk', tag: 'html-css', responsive: true,
          detail: ['HTML/CSS', 'ExpressJS | Heroku']
        }
      ];

      _vm.portfolio.list = _.each(portfolioItem, function (p) {
        p.thumbnail = IMG_PATH + 'thumb-' + p.name + '.jpg';
        p.icon = IMG_PATH + 'icon-' + p.tag + '.png';
        p.demo = p.url || ('https://rhytheme-' + p.name + '.herokuapp.com/');
        return p;
      });

      _vm.portfolio.onLoadFunction = function () {
        $timeout(function () {
          // console.log('loaded');
        });
      };

      _vm.portfolio.onMouseEnter = onMouseEnter;
      _vm.portfolio.onMouseLeave = onMouseLeave;
      _vm.portfolio.onFilter = onFilter;
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
