/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  function treeView($window, $timeout) {
    var tree;

    tree = {
      restrict: 'EA',
      scope: {
        seeds: '=',
        nodes: '=?',
        tools: '=?'
      },
      templateUrl: 'lib/tree-view/directive/templateLight/mainWrapper.html',
      link: function (scope, element) {
        treeViewLink($window, $timeout, scope, element);
      },
      controller: 'TreeViewLightCtrl',
      controllerAs: 'tree',
      bindToController: true
    };

    return tree;
  }

  function treeViewCtrl() {
    /** construction */
    _constructor(this);

    function _constructor(self) {
      var tree = self,
        nodes, seeds, tools;

      // console.log(scope);

      /** get binding models from outside scope */
      seeds = tree.seeds;
      nodes = tree.nodes;
      tools = tree.tools;

      _.isUndefined(nodes) && (nodes = []);
      tree.nodes = nodes;
      /** refer 'tools' with outside scope */
      _.isUndefined(tools) && (tools = {});
      tree.tools = tools;
      /** define equipments that be required */
      tree.tools.build = function () {
        nodes = _build(seeds);
        tree.nodes = _filterRoots(nodes);
      };
      tree.tools.expand = function () {
        tree.nodes = _expand(nodes);
      };
      tree.tools.collapse = function () {
        tree.nodes = _collapse(nodes);
      };

      /** supported functions for individual node */
      tree.expandNode = function (target) {
        if (!target.expanded) {
          var targetIndex, targetChildren;

          target.expanded = true;

          targetIndex = _.findIndex(tree.nodes, function (node) {
            return (node._id === target._id);
          });

          targetIndex++;

          targetChildren = _.filter(nodes, function (node) {
            return (node._id !== target._id) && (node._id.indexOf(target._id) >= 0);
          });

          /** insert new node after targetIndex */
          _.forEach(targetChildren, function (child) {
            tree.nodes.splice(targetIndex, 0, child);
          });
        }
      };
      tree.collapseNode = function (target) {
        if (target.expanded) {
          target.expanded = false;

          _.remove(tree.nodes, function (node) {
            return (node._id !== target._id) && (node._id.indexOf(target._id) >= 0);
          });
        }
      };

      function _filterRoots(nodes) {
        return _.filter(nodes, function (node) {
          return !node.parent;
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

    function _expand(nodes, condition) {
      var iteratee = function (node) {
        _.isArray(node.children) && (node.expanded = !!node.children.length);
        return node;
      };

      if (_.isFunction(condition)) {
        iteratee = condition;
      }

      return _.map(nodes, iteratee);
    }

    function _collapse(nodes, iteratee) {
      var cloned = _.cloneDeep(nodes);

      return _.remove(cloned, function (node) {
        _.isArray(node.children) && (node.expanded = false);
        if (_.isFunction(iteratee)) {
          return iteratee(node);
        }
        return node.level === 0;
      })
    }
  }

  function treeViewLink(window, timeout, scope, element) {
  }

  function treeNode($window, $timeout) {
    var node;

    node = {
      restrict: 'EA',
      scope: {
        core: '=',
        expand: '&',
        collapse: '&'
      },
      templateUrl: 'lib/tree-view/directive/templateLight/node.html',
      link: function (scope, element) {
        treeNodeLink($window, $timeout, scope, element);
      },
      controller: 'TreeNodeCtrl',
      controllerAs: 'node'
    };

    return node;
  }

  function treeNodeCtrl(scope) {
    var node = this,
      CONST = {
        LEVEL_ROOT: 0
      };
    // console.log('scope ', scope);
    // console.log('node ', node);

    _constructor(scope);

    function _constructor(scope) {
      // console.log('core ', scope.core);
      // console.log('tools ', scope.tools);
      node.core = scope.core;
      node.expand = scope.expand;
      node.collapse = scope.collapse;
      // node.expand = function (node) {
      //   console.log(node);
      // function condition() {
      //
      // }
      // scope.tools.expand([node], condition);
      // }
    }
  }

  function treeNodeLink(window, timeout, scope, element) {

  }

  treeView.$inject = ['$window', '$timeout'];
  treeViewCtrl.$inject = [];

  treeNode.$inject = ['$window', '$timeout'];
  treeNodeCtrl.$inject = ['$scope'];

  ng.module('treeViewLight', ['ngSanitize']);

  ng.module('treeViewLight')
    .directive('treeViewLight', treeView)
    .controller('TreeViewLightCtrl', treeViewCtrl);

  ng.module('treeViewLight')
    .directive('treeNode', treeNode)
    .controller('TreeNodeCtrl', treeNodeCtrl);

})(window.angular, window._);