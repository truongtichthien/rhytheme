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

      if (_.isUndefined(tree.seeds) || !tree.seeds.length) {
        console.error('No seeds, no trees! Give me seeds please!');
        return false;
      }

      _.isUndefined(tree.nodes) && (tree.nodes = []);
      _.isUndefined(tree.tools) && (tree.tools = {});
      _.isUndefined(tree.node) && (tree.node = {});
      _.isUndefined(tree.debug) && (tree.debug = {});

      /** reachable functions from outside scope */
      tree.tools.build = _build;
      tree.tools.expand = _expand;
      tree.tools.collapse = _collapse;
      tree.tools.search = _search;

      /** internal usage functions */
      tree.node.toggle = _toggleNode;
      tree.node.select = _selectNode;
      tree.node.maxWidth = _maxWidthOfNodes;
      tree.node.getState = _getNodeState;
      tree.node.setState = _setNodeState;

      /** external functions for debugging */
      tree.debug.getGeneMap = _getGeneMap;
      tree.debug.getInstance = _getInstance;

      function _build() {
        // nodes = _buildTree(tree.seeds);
        instance = _buildTree(tree.seeds);

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

        (_.isString(key))
        && (_doSearch(key))
        && (_expand())
        || (console.error('Searching key is not a string!'));

        function _doSearch(key) {
          /** clear nodes */
          tree.nodes = [];

          var found = [];

          /*todo separate searching function into 2 parts*/

          _.forEach(skeleton, function (o) {
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
        else {
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

          (!!children.length) && (_.forEach(children, function (child) {
            if (instance[child].matched) {
              index++;
              instance[child].appeared = true;
              tree.nodes.splice(index, 0, child);
            }
          }));
        }

        function _collapseNode(target) {

          _.remove(tree.nodes, function (node) {
            /** compare _id to remove children and its descendants */
            if ((node !== target) && (_.includes(node, target))) {
              // instance[node].matched = true;
              instance[node].appeared = false;
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
              instance[node].width = instance[max]['realWidth'] > tree.debug.frameWidth() ? instance[max]['realWidth'] : tree.debug.frameWidth();
            }
          });
        }
      }

      function _getGeneMap() {
        return geneMap;
      }

      function _getInstance() {
        return instance;
      }

      function _getNodeState(id) {
        return (id) && (instance[id]);
      }

      function _setNodeState(id, key, value) {
        (id) && (instance[id][key] = value);
      }
    }

    function _build(seeds) {
      var rootLevel = -1;

      skeleton = [];
      geneMap = {};

      _collectSeed(seeds);

      function _collectSeed(seeds, parent) {
        /** property explanation
         * _id: unique identity
         * root: the _id of the parent node
         * branches: the _id(s) of the children node
         * proto: original seed passed from outside
         * level: generation of node
         * matched, aka asleep (alias): determine whether could appear or not (use for searching)
         * appeared: currently appeared node on tree */

        _.forEach(seeds, function (o) {
          /** need to inspect id */
          !(o.id)
          && (console.error('Every single seed requires a specific ID!'))
          || (function () {
            var id = (parent || '') + o.id;

            /** generate tree skeleton */
            skeleton.push(id);

            geneMap[id] = {};
            geneMap[id]._id = id;
            geneMap[id].proto = _.cloneDeep(o);
            geneMap[id].level = _.get(geneMap[parent], 'level', rootLevel) + 1;
            geneMap[id].root = parent || null;
            // geneMap[id].matched = true;

            /** create children array */
            (parent)
            && (geneMap[parent].branches.push(id));

            /** collect seeds through children */
            _.isArray(o.children)
            && (o.children.length)
            && (geneMap[id].branches = [])
            && (_collectSeed(o.children, id));
          })()
        });
      }

      return _.cloneDeep(geneMap);
    }

    function _expand(nodes) {
      return _.filter(nodes, function (o) {
        /** nodes which marked 'appeared' could be displayed
         * as well as ones 'matched' searching key */
        /*todo not good*/
        (instance[o].matched) && (instance[o].appeared = true);

        if (instance[o].appeared || instance[o].matched) {
          return true;
        }
      });
    }

    function _collapse(nodes) {
      return _.filter(nodes, function (o) {
        /** only display nodes which don't have root and have appeared */
        /*todo not good*/
        return (!instance[o].root) && (instance[o].appeared) || (instance[o].appeared = false);
      });
    }
  }

  function treeViewLink(timeout, scope, element) {
    var tree = scope.tree;

    tree.debug.frameWidth = _treeFrameWidth;
    /** todo: calculate frame's width once window triggers onResize */
    timeout(_treeFrameWidth);

    function _treeFrameWidth() {
      return element.find('.repeat-wrapper')[0].clientWidth;
    }
  }

  treeView.$inject = ['$timeout'];
  treeViewCtrl.$inject = ['$timeout'];

  ng.module('treeViewLight', ['ngSanitize']);

  ng.module('treeViewLight')
    .constant('treeViewConst', treeViewConst);

  ng.module('treeViewLight')
    .directive('treeViewLight', treeView)
    .controller('TreeViewLightCtrl', treeViewCtrl);

})(window.angular, window._);