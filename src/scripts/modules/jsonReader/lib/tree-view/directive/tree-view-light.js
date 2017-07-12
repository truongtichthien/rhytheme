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
         * matched, aka asleep (alias): determine whether could appear or not (use for searching)
         * appeared: currently appeared node on tree */

        nodes = _buildTree(tree.seeds);
        instance = _.cloneDeep(geneMap);

        console.log('skeleton ', skeleton);
        console.log('gene map ', geneMap);
        console.log('instance ', instance);

        /** clear all nodes then re-build to force rendering new node on DOM */
        // tree.nodes = [];
        // $timeout(function () {
        tree.nodes = _.filter(skeleton, function (o) {
          /** display matched node */
          (!instance[o].root)
          && (instance[o].appeared = true)
          && (instance[o].matched = true);
          return !instance[o].root;
        });
        // });

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
        return true;
      }

      function _collapse() {
        tree.nodes = _collapseTree(skeleton);
      }

      function _search(key) {
        console.log('orgKey ', key);

        // _.isString(key)
        // && ((key.trim() !== '') && ());
        // || (key.trim() === '') && (_expand()));

        (_.isString(key))
        && (_doSearch(key))
        && (_expand())
        || (console.error('Searching key is not a string!'));

        function _doSearch(key) {
          /** clear nodes */
          tree.nodes = [];

          var found = [], additional = [];

          /*todo separate searching function into 2 parts*/

          _.forEach(skeleton, function (o) {
            // tree.nodes.push(o);
            instance[o].matched = false;
            instance[o].appeared = false;

            /** compare required string with node's title */
            (_.includes(_.lowerCase(instance[o].proto.title), _.lowerCase(key)))
            /** if true, node is matched */
            && (instance[o].matched = true)
            // && (instance[o].appeared = true)
            && (found.push(o));

            if (instance[o].matched) {
              var root = o;

              while (root) {
                (instance[root].root)
                && (instance[instance[root].root].appeared = true);
                root = instance[root].root;
              }
            }
          });

          // additional = found;

          // _.forEach(found, function (o) {
          //   var index,
          //     root = o;
          //
          //   additional.push(root);
          //   index = additional.length - 1;
          //
          //   while (root) {
          //     if (instance[root].root) {
          //       instance[instance[root].root].appeared = true;
          //
          //       // var str = instance[root].root;
          //       var rootExist = !!_.find(additional, (function (rootId) {
          //         return function (o) {
          //           return rootId === o;
          //         };
          //       })(instance[root].root));
          //
          //       if (!rootExist) {
          //         additional.splice(index, 0, instance[root].root);
          //       }
          //       // index--;
          //     }
          //     root = instance[root].root;
          //   }
          //
          //   // (instance[o].root) && (instance[instance[o].root].appeared = true) && (additional.splice(index, 0, instance[o].root));
          // });

          // $timeout(function () {
          //   tree.nodes = additional;
          // });
          return true;
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

          (!!children.length) && (_.forEach(children, function (child) {
            if (instance[child].matched) {
              index++;
              instance[child].appeared = true;
              tree.nodes.splice(index, 0, child);
            }
          }));

          console.log(instance);
        }

        function _collapseNode(target) {
          // target.expanded = false;

          // instance[target].collapsed = true;
          // instance[target].expanded = !instance[target].collapsed;

          _.remove(tree.nodes, function (node) {
            /** compare _id to remove children and its descendants */
            if ((node !== target) && (_.includes(node, target))) {
              // instance[node].matched = true;
              instance[node].appeared = false;
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
            return instance[node]['realWidth'];
          }
        });

        if (!_.isUndefined(max)) {
          _.forEach(tree.nodes, function (node) {
            if (instance[node].appeared) {
              console.log();
              instance[node].width = instance[max]['realWidth'] > tree.frameWidth() ? instance[max]['realWidth'] : tree.frameWidth();
            }
          });
        }
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
          geneMap[node._id].matched = true;

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
      return _.filter(nodes, function (o) {
        // (instance[o].branches) && (instance[o].expanded = true) && (instance[o].collapsed = !instance[o].expanded);
        /** nodes which marked 'appeared' could be displayed
         * as well as ones 'matched' searching key */
        /*todo not good*/
        if (instance[o].appeared || instance[o].matched) {
          // instance[o].appeared = true;
          return true;
        }
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
        /** only display nodes which don't have root and have appeared */
        /*todo not good*/
        return (!instance[o].root) && (instance[o].appeared);
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
      state,
      treeCtrl;

    treeCtrl = node.treeCtrl = required;

    /** to ensure that element rendered completely */
    timeout(_nodeCompiled);
    scope.$on('$destroy', _nodeDestroy);
    scope.$on('vsRepeatTrigger', function () {
      console.log('vs trigger');
    });

    state = treeCtrl.getNodeState(node.core);

    node.title = state.proto.title;
    node.level = state.level;
    node.width = state.width;

    node.branches = function () {
      var branches = (state.branches) && (state.branches.length || 0);

      (!!branches) && (_.forEach(state.branches, function (o) {
        var s = treeCtrl.getNodeState(o);
        // (s.appeared) && (node.expanded = s.appeared) && (node.collapsed = !node.expanded);
        // (s.matched) && (node.showBranches = s.matched) && (node.expanded = !node.collapsed);
        node.showBranches = s.matched || s.appeared;
        node.expanded = s.appeared;
        // if (s.appeared || s.matched) {
        if (node.expanded || node.showBranches) {
          // treeCtrl.setNodeState(node.core, 'expanded', s.appeared || s.matched);
          return false;
        }
      }));

      return branches;
    };

    // node.expanded = function () {
    //   return !!_.find(state.branches, function (o) {
    //     var s = treeCtrl.getNodeState(o);
    //     return s.appeared;
    //   });
    // };
    // node.collapsed = function () {
    //   return !!_.find(state.branches, function (o) {
    //     var s = treeCtrl.getNodeState(o);
    //     return s.matched;
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