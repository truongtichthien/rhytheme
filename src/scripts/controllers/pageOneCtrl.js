(function (ng) {
  'use strict';

  function pageOneCtrl() {
    var vm = this;
  }

  pageOneCtrl.$inject = [];

  ng.module('sampleApp')
    .controller('PageOneCtrl', pageOneCtrl);
})(angular);