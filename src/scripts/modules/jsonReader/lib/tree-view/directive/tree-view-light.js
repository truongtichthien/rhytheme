/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  var treeViewConst = {
    pxRemRatio: 16
  };

  function treeView($timeout) {
    var tree;
    tree = {
      restrict: 'EA',
      scope: {
        seeds: '=',
        nodes: '=?',
        tools: '=?'
        // search: '=?'
      },
      templateUrl: 'lib/tree-view/directive/templateLight/frame.html',
      link: function (scope, element) {
        treeViewLink($timeout, scope, element);
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

    function _constructor(self, _buildTree, _expandTree, _collapseTree) {
      var tree = self,
        nodes, selectedNode;

      if (_.isUndefined(tree.seeds)) {
        console.error('No seeds, no trees! Give me seed please!');
        return false;
      }

      _.isUndefined(tree.nodes) && (tree.nodes = []);
      _.isUndefined(tree.tools) && (tree.tools = {});
      // _.isUndefined(tree.search) && (tree.search = {});

      /** reachable functions from outside scope */
      tree.tools.build = _build;
      tree.tools.expand = _expand;
      tree.tools.collapse = _collapse;
      tree.tools.search = _search;

      // tree.search.key = '';

      /** internal usage functions */
      tree.toggleNode = _toggleNode;
      tree.selectNode = _selectNode;
      tree.maxWidthOfNodes = _maxWidthOfNodes;

      function _build() {
        nodes = _buildTree(tree.seeds);
        /** clear nodes */
        tree.nodes = [];
        /** re-build nodes by new seeds */
        $timeout(function () {
          tree.nodes = _filterRoots(nodes);
        });

        function _filterRoots(nodes) {
          return _.filter(nodes, function (node) {
            return !node.parent;
          });
        }
      }

      function _expand() {
        tree.nodes = _expandTree(nodes);
      }

      function _collapse() {
        tree.nodes = _collapseTree(tree.nodes);
      }

      function _search(key) {
        console.log('orgKey ', key);
        _.isString(key) && ((key.trim() !== '') && (_doSearch(key)) || (key.trim() === '') && (_expand()));

        function _doSearch(key) {
          /** clear nodes */
          tree.nodes = [];

          var found = [];

          _.forEach(nodes, function (o) {
            (_.includes(_.lowerCase(o.title), _.lowerCase(key))) && (found.push(o));
          });

          $timeout(function () {
            tree.nodes = found;
          });
        }
      }

      function _toggleNode(target, index) {
        if (!target.expanded) {
          _expandNode(target, index);
        } else {
          _collapseNode(target, index);
        }

        function _expandNode(target, index) {
          target.expanded = true;
          /** insert new node after targetIndex */
          var children = _.filter(nodes, function (node) {
            return (node._id !== target._id) &&
              (_.includes(node._id, target._id)) &&
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
            /** compare _id to remove children and its descendants */
            if ((node._id !== target._id) && (_.includes(node._id, target._id))) {
              (node.selected) && (node.selected = false);
              (node.children && node.expanded) && (node.expanded = false);
              return true;
            }
            return false;
          });
        }
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
            return node.realWidth;
          }
        });

        _.forEach(tree.nodes, function (node) {
          if (node.appear) {
            console.log();
            node.width = max.realWidth > tree.frameWidth() ? max.realWidth : tree.frameWidth();
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

  function treeViewLink(timeout, scope, element) {
    var tree = scope.tree;

    tree.frameWidth = _treeFrameWidth;
    /** todo: calculate frame's width once window triggers onResize */
    timeout(_treeFrameWidth);

    scope.$on('vsRepeatTrigger', function () {
      console.log('vs trigger');
    });

    function _treeFrameWidth() {
      return element.find('.repeat-wrapper')[0].clientWidth;
    }
  }

  function treeNode($timeout, treeViewConst) {
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
        treeNodeLink($timeout, treeViewConst, scope, element, required);
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

    function _constructor(self) {
      var node = self;

      node.select = function (event) {
        event.stopPropagation();
        /** call binding toggleNode function */
        node.toggle();
      };
    }
  }

  function treeNodeLink(timeout, treeViewConst, scope, element, required) {
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
      node.core.realWidth = _nodeWidth(node.core);

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

  treeView.$inject = ['$timeout'];
  treeViewCtrl.$inject = ['$timeout'];

  treeNode.$inject = ['$timeout', 'treeViewConst'];
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