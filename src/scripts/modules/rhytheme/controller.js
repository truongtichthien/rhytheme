/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function RhythemeController(portfolio, about) {
    /** variable definition */
    var vm = this,
      pages = ['portfolio', 'about'],
      template = {},
      view = {};

    /** variable binding */
    vm.currentTemplate = '';
    vm.view = view;
    vm.toPortfolio = _toPortfolio;
    vm.toAbout = _toAbout;

    vm.panelModel = {
      iconClass: 'custom-icon',
      headerTitle: 'OV Full-screen Component by Thien Truong'
    };

    /** function execution */
    _initModel();
    _toPortfolio();

    /** function definition */
    function _initModel() {
      _.forEach(pages, function (p) {
        template[p] = 'scripts/modules/rhytheme/view.' + p + '.html';
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
  }

  RhythemeController.$inject = ['portfolioDecorator', 'aboutDecorator'];

  ng.module('rhythemeModule')
    .controller('RhythemeController', RhythemeController);

})(window.angular, window._);