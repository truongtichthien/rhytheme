(function (ng) {
  'use strict';

  function ovFullScreenCtrl() {
    var vm = this;
    vm.panelModel = {
      iconClass: 'custom-icon',
      headerTitle: 'OV Full-screen Component by Thien Truong'
    };

    vm.jumbotron = {};
  }

  ovFullScreenCtrl.$inject = [];

  ng.module('sampleApp')
    .controller('OvFullScreenCtrl', ovFullScreenCtrl);
})(angular);