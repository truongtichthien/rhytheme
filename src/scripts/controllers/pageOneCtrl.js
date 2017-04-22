(function (ng) {
  'use strict';

  function pageOneCtrl() {
    var vm = this;
  }

  pageOneCtrl.$inject = [];

  ng.module('rhythemeModule')
    .controller('PageOneCtrl', pageOneCtrl);
})(angular);