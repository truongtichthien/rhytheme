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

  ng.module('rhythemeModule')
    .controller('OvFullScreenCtrl', ovFullScreenCtrl);
})(angular);