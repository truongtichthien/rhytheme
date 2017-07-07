/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  function treeViewLight($window, $timeout) {
    var tree;

    tree = {
      restrict: 'EA',
      scope: {
        seeds: '='
      },
      templateUrl: 'lib/tree-view/directive/templateLight/mainWrapper.html',
      link: function (scope, element) {
        treeViewLightLink($window, $timeout, scope, element);
      },
      controller: 'TreeViewLightCtrl',
      controllerAs: 'vm'
    };

    return tree;
  }

  function treeViewLightCtrl(scope) {
    var vm = this;
    console.log('scope ', scope);
    console.log('vm ', vm);
  }

  function treeViewLightLink(window, timeout, scope, element) {
  }

  function treeNode() {
    var node;

    node = {
      restrict: 'EA',
      scope: {
        core: '='
      },
      templateUrl: '',
      link: function (scope, element) {
        treeNodeLink($window, $timeout, scope, element);
      },
      controller: 'TreeNodeCtrl',
      controllerAs: 'vm'
    };

    return node;
  }

  function treeNodeCtrl(scope) {
    var vm = this;
    console.log('scope ', scope);
    console.log('vm ', vm);
  }

  function treeNodeLink(window, timeout, scope, element) {

  }

  treeViewLight.$inject = ['$window', '$timeout'];
  treeViewLightCtrl.$inject = ['$scope'];

  treeNode.$inject = ['$window', '$timeout'];
  treeNodeCtrl.$inject = ['$scope'];

  ng.module('treeViewLight', ['ngSanitize']);

  ng.module('treeViewLight')
    .directive('treeViewLight', treeViewLight)
    .controller('TreeViewLightCtrl', treeViewLightCtrl);

  ng.module('treeViewLight')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);