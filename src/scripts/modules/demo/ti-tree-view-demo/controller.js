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
      vm.seeds = [
        {
          id: 'parentZero',
          title: 'Parent Zero',
          onClick: function () {
            console.log('Chay ne!');
          },
          children: [
            { id: 'alpha', title: 'Alpha' },
            { id: 'bravo', title: 'Bravo' }
          ]
        },
        {
          id: 'parentOne',
          title: 'Parent One',
          icon: 'glyphicon glyphicon-globe',
          children: [
            { id: 'charlie', title: 'Charlie' },
            {
              id: 'delta',
              title: 'Delta',
              children: [
                { id: 'golf', title: 'Golf' },
                { id: 'hotel', title: 'Hotel' }
              ]
            }
          ]
        }
      ];

      $timeout(function () {
        vm.seeds.push({
          id: 'parentTwo',
          title: 'Parent Two',
          children: [
            { id: 'echo', title: 'Echo Echo Echo Echo Echo Echo' },
            { id: 'foxtrot', title: 'Foxtrot Foxtrot Foxtrot Foxtrot Foxtrot Foxtrot' }
          ]
        });
      }, 100);
    }
  }

  TiTreeViewDemoController.$inject = ['$timeout'];

  ng.module('demoModule')
    .controller('TiTreeViewDemoController', TiTreeViewDemoController);

})(window.angular, window._);