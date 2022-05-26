/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function RhythemeController(portfolio, about, _root) {
    /** variable definition */
    var vm = this,
      pages = ['portfolio', 'about'],
      template = {},
      view = {};

    /** function definition */
    function _initModel() {
      _.forEach(pages, function (p) {
        template[p] = 'scripts/app/rhytheme/view.' + p + '.html';
        view[p] = false;
      });

      portfolio.decorate(vm).init();
      about.decorate(vm).init();
    }

    function _switchView(page) {
      _.forEach(view, function (p, k) {
        view[k] = (k === page);
      });

      return template[page];
    }

    function _toPortfolio() {
      vm.currentTemplate = _switchView(pages[0]);
    }

    function _toAbout() {
      vm.currentTemplate = _switchView(pages[1]);
    }

    /** variable binding */
    vm.currentTemplate = '';
    vm.view = view;
    vm.toPortfolio = _toPortfolio;
    vm.toAbout = _toAbout;

    /** function execution */
    _initModel();
    _toPortfolio();

    _root.$on('$includeContentRequested', function(event, templateName){
      // console.log(event, templateName);
    });

    _root.$on('$includeContentLoaded', function(event, templateName){
      // console.log(event, templateName);
    });
  }

  RhythemeController.$inject = ['portfolioDecorator', 'aboutDecorator', '$rootScope'];

  ng.module('rhythemeModule')
    .controller('RhythemeController', RhythemeController);

})(window.angular, window._);
