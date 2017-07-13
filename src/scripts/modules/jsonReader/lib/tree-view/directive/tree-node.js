/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  function treeNode(timeout, treeConst) {
    var node;
    node = {
      restrict: 'EA',
      require: '^treeViewLight',
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
      treeCtrl;

    treeCtrl = node.treeCtrl = required;

    /** to ensure that element rendered completely */
    timeout(_nodeCompiled);
    scope.$on('$destroy', _nodeDestroy);

    node.branches = function () {
      var state = treeCtrl.node.getState(node.core),
        branches = (state.branches) && (state.branches.length || 0);

      node.title = state.proto.title;
      node.level = state.level;
      node.width = state.width;
      node.matched = state.matched;
      node.childMatched = state.childMatched;
      node.highlighted = state.highlighted;

      (!!branches) && (_.forEach(state.branches, function (o) {
        var s = treeCtrl.node.getState(o);
        node.expanded = s.appeared;
        if (node.expanded) {
          return false;
        }
      }));

      return branches;
    };
    node.click = function (event) {
      event.stopPropagation();
      /** call binding toggleNode function */
      node.toggle();
    };

    function _nodeCompiled() {
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
      timeout(treeCtrl.node.maxWidth);
    }
  }

  treeNode.$inject = ['$timeout', 'treeViewConst'];
  treeNodeCtrl.$inject = [];

  ng.module('treeViewLight')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);