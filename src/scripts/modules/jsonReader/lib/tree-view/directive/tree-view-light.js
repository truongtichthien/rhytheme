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
    var skeleton, geneMap, instance;

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
      tree.getGeneMap = _getGeneMap;
      tree.getNodeState = _getNodeState;
      tree.setNodeState = _setNodeState;

      function _build() {
        /** property explanation
         * _id: unique identity
         * root: the _id of the parent node
         * branches: the _id(s) of the children node
         * proto: original seed passed from outside
         * level: generation of node
         * asleep: determine whether could appear or not (use for searching)
         * appeared: node currently appears on tree */

        nodes = _buildTree(tree.seeds);

        console.log('skeleton ', skeleton);
        console.log('gene map ', geneMap);
        instance = _.cloneDeep(geneMap);

        /** clear all nodes then re-build to force rendering new node on DOM */
        tree.nodes = [];
        $timeout(function () {
          tree.nodes = _.filter(skeleton, function (o) {
            /** display matched node */
            (!instance[o].root) && (instance[o].appeared = true) && (instance[o].asleep = false);
            return !instance[o].root;
          });

          console.log('instance ', instance);
        });

        // /** clear nodes */
        // tree.nodes = [];
        // /** re-build nodes by new seeds */
        // $timeout(function () {
        //   tree.nodes = _filterRoots(nodes);
        // });
        // function _filterRoots(nodes) {
        //   return _.filter(nodes, function (node) {
        //     return !node.parent;
        //   });
        // }
      }

      function _expand() {
        tree.nodes = _expandTree(skeleton);
      }

      function _collapse() {
        tree.nodes = _collapseTree(skeleton);
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
        var isExpanded = !!(_.filter(instance[target].branches, function (o) {
          return instance[o].appeared;
        })).length;

        if (!isExpanded) {
          _expandNode(target, index);
        }
        else /*if (!instance[target].collapsed)*/ {
          _collapseNode(target, index);
        }

        function _expandNode(target, index) {
          // target.expanded = true;
          /** insert new node after targetIndex */
            // var children = _.filter(nodes, function (node) {
            //   return (node._id !== target._id) &&
            //     (_.includes(node._id, target._id)) &&
            //     (node.parent._id === target._id);
            // });
          var children = instance[target].branches;

          // instance[target].expanded = true;
          // instance[target].collapsed = !instance[target].expanded;

          _.forEach(children, function (child) {
            index++;
            instance[child].asleep = false;
            instance[child].appeared = !instance[child].asleep;
            tree.nodes.splice(index, 0, child);
          });

          console.log(instance);
        }

        function _collapseNode(target) {
          // target.expanded = false;

          // instance[target].collapsed = true;
          // instance[target].expanded = !instance[target].collapsed;

          _.remove(tree.nodes, function (node) {
            /** compare _id to remove children and its descendants */
            if ((node !== target) && (_.includes(node, target))) {
              instance[node].asleep = true;
              instance[node].appeared = !instance[node].asleep;
              // (node.selected) && (node.selected = false);
              // (node.children && node.expanded) && (node.expanded = false);
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
          if (instance[node].appeared) {
            return instance[node].realWidth;
          }
        });

        _.forEach(tree.nodes, function (node) {
          if (instance[node].appeared) {
            console.log();
            instance[node].width = instance[max].realWidth > tree.frameWidth() ? instance[max].realWidth : tree.frameWidth();
          }
        });
      }

      function _getGeneMap() {
        return geneMap;
      }

      function _getNodeState(id) {
        return (id) && (instance[id]);
      }

      function _setNodeState(id, key, value) {
        (id) && (instance[id][key] = value);
      }
    }

    function _build(seeds) {
      var nodes = [],
        rootLevel = -1;

      skeleton = [];
      geneMap = {};

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

          /** consider deprecation */
          node._id = _.get(parent, '_id', '') + s.id;
          node.level = _.get(parent, 'level', rootLevel) + 1;
          node.parent = parent || null;

          nodes.push(node);
          skeleton.push(node._id);
          geneMap[node._id] = {};
          geneMap[node._id].proto = _.cloneDeep(s);
          geneMap[node._id]._id = _.get(parent, '_id', '') + s.id;
          geneMap[node._id].level = _.get(parent, 'level', rootLevel) + 1;
          geneMap[node._id].root = _.get(parent, '_id', null);
          geneMap[node._id].asleep = true;

          /** create children array */
          (parent) && (geneMap[parent._id].branches.push(node._id));

          if (_.isArray(node.children) && (node.children.length)) {
            geneMap[node._id].branches = [];
            _collectSeed(node.children, node);
          }
        });
      }

      return nodes;
    }

    function _expand(nodes) {
      // var iteratee = function (node) {
      //   _.isArray(node.children) && (node.expanded = true);
      //   return node;
      // };
      // return _.map(nodes, iteratee);
      return _.map(nodes, function (o) {
        // (instance[o].branches) && (instance[o].expanded = true) && (instance[o].collapsed = !instance[o].expanded);
        instance[o].asleep = false;
        instance[o].appeared = !instance[o].asleep;

        return o;
      });
    }

    function _collapse(nodes) {
      // _.remove(nodes, function (node) {
      //   _.isArray(node.children) && (node.expanded = false);
      //   (node.selected) && (node.selected = false);
      //   return node.level > 0;
      // });
      // return nodes;

      return _.filter(nodes, function (o) {
        /** display matched node */
        if (!instance[o].root) {
          instance[o].appeared = true;
          instance[o].asleep = !instance[o].appeared;
        } else {
          instance[o].appeared = false;
          instance[o].asleep = !instance[o].appeared;
        }
        return !instance[o].root;
      });
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
      nodeState,
      treeCtrl;

    treeCtrl = node.treeCtrl = required;

    /** to ensure that element rendered completely */
    timeout(_nodeCompiled);
    scope.$on('$destroy', _nodeDestroy);
    scope.$on('vsRepeatTrigger', function () {
      console.log('vs trigger');
    });

    nodeState = treeCtrl.getNodeState(node.core);

    node.title = nodeState.proto.title;
    node.level = nodeState.level;
    node.width = nodeState.width;

    node.branches = function () {
      var branches = (nodeState.branches) && (nodeState.branches.length || 0);

      _.forEach(nodeState.branches, function (o) {
        var s = treeCtrl.getNodeState(o);
        (s.appeared) && (node.expanded = s.appeared) && (node.collapsed = !node.expanded);
        (s.asleep) && (node.collapsed = s.asleep) && (node.expanded = !node.collapsed);
        if (s.appeared || s.asleep) {
          // treeCtrl.setNodeState(node.core, 'expanded', s.appeared || s.asleep);
          return false;
        }
      });

      return branches;
    };

    // node.expanded = function () {
    //   return !!_.find(nodeState.branches, function (o) {
    //     var s = treeCtrl.getNodeState(o);
    //     return s.appeared;
    //   });
    // };
    // node.collapsed = function () {
    //   return !!_.find(nodeState.branches, function (o) {
    //     var s = treeCtrl.getNodeState(o);
    //     return s.asleep;
    //   });
    // };

    // console.log(treeCtrl.getNodeState());
    // console.log(treeCtrl.getNodeState('parentOne'));

    function _nodeCompiled() {
      // node.core.appear = true;
      // node.core.realWidth = _nodeWidth(node.core);

      var width = _nodeWidth(node.core);
      treeCtrl.setNodeState(node.core, 'realWidth', width);

      timeout(treeCtrl.maxWidthOfNodes);
    }

    function _nodeWidth(node) {
      var width, padding;
      width = element.find('.node-title').width();
      padding = treeCtrl.getNodeState(node).level * treeViewConst.pxRemRatio;
      return width + padding;
    }

    function _nodeDestroy() {
      // node.core.appear = false;

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