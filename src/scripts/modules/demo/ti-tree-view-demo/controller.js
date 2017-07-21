/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function TiTreeViewDemoController($timeout) {
    var vm;
    /** execute constructor */
    _constructor(this);

    /** function definition */
    function _constructor(self) {
      vm = self;

      _initModel(vm);
    }

    function _initModel(vm) {
      // vm.nodes = [];
      // vm.tools = {};
      vm.search = {
        key: '',
        sensitive: true
      };
      vm.node = {
        id: ''
      };
      vm.seeds = [];

      $timeout(function () {
        vm.seeds.push({
          id: 'parentTwo',
          title: 'Parent Two Parent Two Parent Two Parent Two Parent Two',
          icon: 'glyphicon glyphicon-globe',
          children: [
            { id: 'echo', title: 'Echo Echo Echo Echo Echo Echo' },
            {
              id: 'foxtrot',
              title: 'Foxtrot Foxtrot Foxtrot Foxtrot Foxtrot Foxtrot',
              icon: 'glyphicon glyphicon-globe'
            }
          ]
        });
        var promise = vm.tools.build();
        (promise) && (promise.then(function (data) {
          console.log('Built ', data);
        }))
      }, 5000);
    }
  }

  TiTreeViewDemoController.$inject = ['$timeout'];

  ng.module('demoModule')
    .controller('TiTreeViewDemoController', TiTreeViewDemoController);

})(window.angular, window._);