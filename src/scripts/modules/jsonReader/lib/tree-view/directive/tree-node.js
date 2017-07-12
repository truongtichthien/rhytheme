/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  function treeNode(timeout, treeConst) {
    var node;
    node = {
      restrict: 'EA',
      require: '^^treeViewLight',
      scope: {
        core: '=',
        toggle: '&'
      },
      templateUrl: 'lib/tree-view/directive/templateLight/node.html',
      link: function (scope, element, attribute, required) {
        treeNodeLink(timeout, treeConst, scope, element, required);
      },
      controller: 'TreeNodeCtrl',
      controllerAs: 'node',
      bindToController: true
    };
    return node;
  }

  function treeNodeCtrl() {
    /** execute constructor */
    _constructor(this);

    function _constructor(/*self*/) {
      // do stuff
    }
  }

  function treeNodeLink(timeout, treeConst, scope, element, required) {
    var node = scope.node,
      state, treeCtrl;

    treeCtrl = node.treeCtrl = required;

    /** to ensure that element rendered completely */
    timeout(_nodeCompiled);
    scope.$on('$destroy', _nodeDestroy);

    state = treeCtrl.node.getState(node.core);

    node.title = state.proto.title;
    node.level = state.level;
    node.width = state.width;

    node.branches = function () {
      var branches = (state.branches) && (state.branches.length || 0);

      (!!branches) && (_.forEach(state.branches, function (o) {
        var s = treeCtrl.node.getState(o);
        // (s.appeared) && (node.expanded = s.appeared) && (node.collapsed = !node.expanded);
        // (s.matched) && (node.showBranches = s.matched) && (node.expanded = !node.collapsed);
        node.showBranches = s.matched || s.appeared;
        node.expanded = s.appeared;
        // if (s.appeared || s.matched) {
        if (node.expanded || node.showBranches) {
          // treeCtrl.node.setState(node.core, 'expanded', s.appeared || s.matched);
          return false;
        }
      }));

      return branches;
    };
    node.select = function (event) {
      event.stopPropagation();
      /** call binding toggleNode function */
      node.toggle();
    };

    // node.expanded = function () {
    //   return !!_.find(state.branches, function (o) {
    //     var s = treeCtrl.node.getState(o);
    //     return s.appeared;
    //   });
    // };
    // node.collapsed = function () {
    //   return !!_.find(state.branches, function (o) {
    //     var s = treeCtrl.node.getState(o);
    //     return s.matched;
    //   });
    // };

    function _nodeCompiled() {
      // node.core.appear = true;
      // node.core.realWidth = _nodeWidth(node.core);

      var width = _nodeWidth(node.core);
      treeCtrl.node.setState(node.core, 'realWidth', width);

      timeout(treeCtrl.node.maxWidth);
    }

    function _nodeWidth(node) {
      var width, padding;
      width = element.find('.node-title').width();
      padding = treeCtrl.node.getState(node).level * treeConst.pxRemRatio;
      return width + padding;
    }

    function _nodeDestroy() {
      // node.core.appear = false;

      timeout(treeCtrl.node.maxWidth);
    }
  }

  treeNode.$inject = ['$timeout', 'treeViewConst'];
  treeNodeCtrl.$inject = [];

  ng.module('treeViewLight')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);