/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function TiTreeViewDemoController(_scope, _timeout) {
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

      vm.init = function () {
        vm.tools.pick('parentOne');
      };

      _timeout(function () {
        vm.seeds = [{
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
        }];
        // var promise = vm.tools.build();
        // (promise) && (promise.then(function (data) {
        //   console.log('Built', data);
        _scope.$evalAsync(function () {
          vm.tools.build();
          vm.tools.pick('parentZero');
        });
        // }));
      }, 2000);
    }
  }

  TiTreeViewDemoController.$inject = ['$scope', '$timeout'];

  ng.module('demoModule')
    .controller('TiTreeViewDemoController', TiTreeViewDemoController);

})(window.angular, window._);