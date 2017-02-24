(function (ng) {
  'use strict';

  function ovFullScreenCtrl() {
    var vm = this;
    vm.apiOvFullScreen = {};
  }

  ovFullScreenCtrl.$inject = [];

  ng.module('sampleApp')
    .controller('OvFullScreenCtrl', ovFullScreenCtrl);
})(angular);