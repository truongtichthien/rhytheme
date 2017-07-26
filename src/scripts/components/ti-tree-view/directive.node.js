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

  function treeNodeLink(_timeout, treeConst, scope, element, required) {
    var node = scope.node,
      treeCtrl = required;

    /** define binding functions */
    node.branches = _branches;
    node.toggle = _toggle;

    /** to ensure that element rendered completely */
    _timeout(_nodeCompiled);
    scope.$on('$destroy', _nodeDestroy);

    function _nodeCompiled() {
      var width = _nodeWidth(node.id);
      treeCtrl.node.setState(node.id, 'realWidth', width);

      /** determine the max value among nodes' width */
      treeCtrl.node.maxWidth();
    }

    function _nodeWidth(node) {
      var padding, margin, content;

      padding = parseInt(element.find('.node-frame').css('padding-left'));
      margin = 20;
      content = element.find('.node-content').width();

      return content + padding + margin;
    }

    function _nodeDestroy() {
      _timeout(treeCtrl.node.maxWidth);
    }

    function _branches() {
      var state = treeCtrl.node.getState(node.id);
      (state) && (function () {
        var branches = (state.branches) && (state.branches.length || 0);

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
      })();
      return [];
    }

    function _toggle(event, node) {
      event.stopPropagation();
      /** call binding toggleNode function */
      treeCtrl.node.toggle(node);
    }
  }

  treeNode.$inject = ['$timeout', 'treeViewConst'];
  treeNodeCtrl.$inject = [];

  ng.module('tiTreeViewModule')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);