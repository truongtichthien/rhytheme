/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  function treeNode(timeout, treeConst) {
    var node;
    node = {
      restrict: 'EA',
      require: '^treeView',
      scope: {
        id: '='
      },
      templateUrl: 'scripts/components/ti-tree-view/view.node.html',
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
      var state = treeCtrl.node.getState(node.id),
        branches = (state.branches) && (state.branches.length || 0);

      node.title = state.core.title;
      node.icon = state.core.icon;
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
    node.toggle = function (event, node) {
      event.stopPropagation();
      /** call binding toggleNode function */
      treeCtrl.node.toggle(node);
    };

    function _nodeCompiled() {
      var width = _nodeWidth(node.id);
      treeCtrl.node.setState(node.id, 'realWidth', width);

      timeout(treeCtrl.node.maxWidth);
    }

    function _nodeWidth(node) {
      var toggle, icon, title, padding, margin;

      toggle = (element.find('.node-toggle').width() || 0);
      icon = (element.find('.node-icon').width() || 0) + 4; // distance between 2 <span>s in 2 continuous lines is 4px

      title = (element.find('.node-title').width() || 0);
      padding = parseInt(element.find('.node-content').css('padding-left'));
      margin = 20;

      return toggle + icon + title + padding + margin;
    }

    function _nodeDestroy() {
      timeout(treeCtrl.node.maxWidth);
    }
  }

  treeNode.$inject = ['$timeout', 'treeViewConst'];
  treeNodeCtrl.$inject = [];

  ng.module('tiTreeViewModule')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);