/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  var treeViewConst = {
    pxRemRatio: 16
  };

  function treeView($window, $timeout) {
    var tree;

    tree = {
      restrict: 'EA',
      scope: {
        seeds: '=',
        nodes: '=?',
        tools: '=?'
      },
      templateUrl: 'lib/tree-view/directive/templateLight/frame.html',
      link: function (scope, element) {
        treeViewLink($window, $timeout, scope, element);
      },
      controller: 'TreeViewLightCtrl',
      controllerAs: 'tree',
      bindToController: true
    };

    return tree;
  }

  function treeViewCtrl($timeout) {
    /** execute constructor */
    _constructor(this, _build, _expand, _collapse);

    function _constructor(self, build, expand, collapse) {
      var tree = self,
        seeds, nodes,
        selectedNode;

      /** get binding models from outside scope */
      seeds = tree.seeds;

      _.isUndefined(tree.nodes) && (tree.nodes = []);
      _.isUndefined(tree.tools) && (tree.tools = {});
      _.isUndefined(tree.fn) && (tree.fn = {});

      /** define equipments that be required */
      tree.tools.build = _build;
      tree.tools.expand = _expand;
      tree.tools.collapse = _collapse;

      /** supported functions for individual node */
      tree.fn.toggleNode = _toggleNode;

      /** owned functions */

      tree.selectNode = _selectNode;
      // tree.toggleNode = _toggleNode;
      tree.maxWidthOfNodes = _maxWidthOfNodes;

      function _filterRoots(nodes) {
        return _.filter(nodes, function (node) {
          return !node.parent;
        });
      }

      function _build() {
        nodes = build(seeds);
        /** clear nodes */
        tree.nodes = [];
        /** re-build nodes by new seeds */
        $timeout(function () {
          tree.nodes = _filterRoots(nodes);
        });
      }

      function _expand() {
        tree.nodes = expand(nodes);
      }

      function _collapse() {
        tree.nodes = collapse(tree.nodes);
      }

      function _toggleNode(target, index) {
        // $event.stopPropagation();
        if (!target.expanded) {
          _expandNode(target, index);
        } else {
          _collapseNode(target, index);
        }
      }

      function _expandNode(target, index) {
        target.expanded = true;
        /** insert new node after targetIndex */
        var children = _.filter(nodes, function (node) {
          /*todo find targetID*/
          return (node._id !== target._id) &&
            (node._id.indexOf(target._id) >= 0) &&
            (node.parent._id === target._id);
        });
        _.forEach(children, function (child) {
          index++;
          tree.nodes.splice(index, 0, child);
        });
      }

      function _collapseNode(target) {
        target.expanded = false;
        _.remove(tree.nodes, function (node) {
          (target.expanded) && (target.expanded = false);
          (target.selected) && (target.selected = false);
          _.forEach(target.children, function (child) {
            (child.expanded) && (child.expanded = false);
          });
          return (node._id !== target._id) && (node._id.indexOf(target._id) >= 0);
        });
      }

      function _selectNode(target) {
        /** disabled selected inside referenced node */
        selectedNode && (selectedNode.selected = false);
        /** enabled selected */
        target.selected = true;
        /** keep reference */
        selectedNode = target;
      }

      function _maxWidthOfNodes() {
        var max = _.maxBy(tree.nodes, function (node) {
          if (node.appear) {
            return node.actualWidth;
          }
        });

        _.forEach(tree.nodes, function (node) {
          if (node.appear) {
            console.log();
            node.width = max.actualWidth > tree.frameWidth() ? max.actualWidth : tree.frameWidth();
          }
        });
      }
    }

    function _build(seeds) {
      var nodes = [],
        rootLevel = -1;

      _collectSeed(seeds);

      function _inspectSeed(seed) {
        return seed.id;
      }

      function _collectSeed(seeds, parent) {
        var node;
        _.forEach(seeds, function (s) {
          /** need to inspect seed's ID */
          if (!_inspectSeed(s)) {
            console.error('Every single seed requires a specific ID!!!');
            return false;
          }

          node = _.cloneDeep(s);

          node._id = _.get(parent, '_id', '') + s.id;
          node.level = _.get(parent, 'level', rootLevel) + 1;
          node.parent = parent || null;

          nodes.push(node);

          if (_.isArray(node.children) && (node.children.length)) {
            _collectSeed(node.children, node);
          }
        });
      }

      return nodes;
    }

    function _expand(nodes) {
      var iteratee = function (node) {
        _.isArray(node.children) && (node.expanded = true);
        return node;
      };

      return _.map(nodes, iteratee);
    }

    function _collapse(nodes) {
      _.remove(nodes, function (node) {
        _.isArray(node.children) && (node.expanded = false);
        (node.selected) && (node.selected = false);
        return node.level > 0;
      });

      return nodes;
    }
  }

  function treeViewLink(window, timeout, scope, element) {
    var tree = scope.tree;

    tree.frameWidth = _treeFrameWidth;

    timeout(_treeFrameWidth);

    scope.$on('vsRepeatTrigger', function () {
      console.log('vs trigger');
    });

    function _treeFrameWidth() {
      return element.find('.repeat-wrapper')[0].clientWidth;
    }
  }

  function treeNode($window, $timeout, treeViewConst) {
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
        treeNodeLink($window, $timeout, treeViewConst, scope, element, attribute, required);
      },
      controller: 'TreeNodeCtrl',
      controllerAs: 'node',
      bindToController: true
    };
    return node;
  }

  function treeNodeCtrl(scope) {

    /** execute constructor */
    _constructor(this);

    function _constructor(self) {
      var node = self;

      node.select = function (event) {
        /*todo enhance function selectNode*/
        event.stopPropagation();
        node.toggle();
        // treeCtrl.toggleNode(target, index, event);
      };
    }
  }

  function treeNodeLink(window, timeout, treeViewConst, scope, element, attribute, required) {
    var node = scope.node,
      treeCtrl = required;

    /** to ensure that element rendered completely */
    timeout(_nodeCompiled);
    scope.$on('$destroy', _nodeDestroy);
    scope.$on('vsRepeatTrigger', function () {
      console.log('vs trigger');
    });

    function _nodeCompiled() {
      node.core.appear = true;
      node.core.actualWidth = _nodeWidth(node.core);

      timeout(treeCtrl.maxWidthOfNodes);
    }

    function _nodeWidth(code) {
      var width, padding;
      width = element.find('.node-title').width();
      padding = code.level * treeViewConst.pxRemRatio;
      return width + padding;
    }

    function _nodeDestroy() {
      node.core.appear = false;

      timeout(treeCtrl.maxWidthOfNodes);
    }
  }

  treeView.$inject = ['$window', '$timeout'];
  treeViewCtrl.$inject = ['$timeout'];

  treeNode.$inject = ['$window', '$timeout', 'treeViewConst'];
  treeNodeCtrl.$inject = ['$scope'];

  ng.module('treeViewLight', ['ngSanitize']);

  ng.module('treeViewLight')
    .constant('treeViewConst', treeViewConst);

  ng.module('treeViewLight')
    .directive('treeViewLight', treeView)
    .controller('TreeViewLightCtrl', treeViewCtrl);

  ng.module('treeViewLight')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);