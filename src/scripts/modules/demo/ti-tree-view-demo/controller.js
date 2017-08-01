/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function TiTreeViewDemoController(_timeout, _q) {
    var vm;
    /** execute constructor */
    _constructor(this);

    /** function definition */
    function _constructor(self) {
      vm = self;

      _initModel(vm);
    }

    function _initModel(vm) {
      /** vm.nodes = [];
       * vm.tools = {}; */
      vm.search = {
        key: '',
        sensitive: true
      };
      vm.node = {
        id: ''
      };
      vm.onLoad = function (api) {
        console.log(api);
        vm.tools = api;
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
          title: 'Parent One Parent One Parent One Parent One Parent One Parent One',
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

      vm.defer = _q.defer();
      var promise = vm.defer.promise;

      promise.then(function (msg) {
        console.log('promise ', msg);
        var seed = [
          {
            id: 'parentFour',
            title: 'Parent Four',
            onClick: function () {
              console.log('Chay ne!');
            },
            children: [
              { id: 'alpha', title: 'Alpha' },
              { id: 'bravo', title: 'Bravo' }
            ]
          }
        ];
        vm.tools
          .build(seed)
          .pick('parentFour');
      });

      _timeout(function () {
        (vm.tools)
        && (vm.tools
            .build(vm.seeds)
            .pick('parentZero')
            .expand()
        );
      }, 2000);

      _timeout(function () {
        (vm.tools)
        && (vm.tools
            .disable('parentZero')
            .pick('parentOne')
        );
      }, 5000);
    }
  }

  TiTreeViewDemoController.$inject = ['$timeout', '$q'];

  ng.module('demoModule')
    .controller('TiTreeViewDemoController', TiTreeViewDemoController);

})(window.angular, window._);