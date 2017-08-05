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

  function treeViewCtrl($timeout, $sce) {
    var tree;

    /** execute constructor */
    _constructor(this);
    _init();

    function _constructor(self) {
      tree = self;
    }

    function _init() {
      var _skeleton, _geneMap, _instance,
        selectedNode;

      var _observer = {
        canBuild: false,
        canExpand: false,
        canCollapse: false,
        canSearch: false,
        canPick: false
      };

      (_.isUndefined(tree.seeds) || !tree.seeds.length)
      && (function () {
        console.error('No seeds, no trees! Give me seeds please!');
        return false;
      })();

      _observer.canBuild = true;

      _.isUndefined(tree.nodes) && (tree.nodes = []);
      _.isUndefined(tree.tools) && (tree.tools = {});
      _.isUndefined(tree.node) && (tree.node = {});
      _.isUndefined(tree.debug) && (tree.debug = {});

      /** reachable functions from outside scope */
      tree.tools.build = _build;
      tree.tools.expand = _expand;
      tree.tools.collapse = _collapse;
      tree.tools.search = _search;
      tree.tools.pick = _pick;
      tree.tools.observer = _observer;

      /** internal usage functions */
      tree.node.toggle = _toggleNode;
      tree.node.select = _selectNode;
      tree.node.maxWidth = _maxWidthOfNodes;
      tree.node.getState = _getNodeState;
      tree.node.setState = _setNodeState;

      /** external functions for debugging */
      tree.debug.getSkeleton = _getSkeleton;
      tree.debug.getGeneMap = _getGeneMap;
      tree.debug.getInstance = _getInstance;

      function _build() {
        var rootLevel = -1;

        _skeleton = [];
        _geneMap = _collectSeed(tree.seeds);
        _instance = _.cloneDeep(_geneMap);

        // console.info('skeleton ', _skeleton);
        // console.info('gene map ', _geneMap);
        // console.info('instance ', _instance);

        tree.nodes = [];
        $timeout(function () {
          tree.nodes = _.filter(_skeleton, function (o) {
            /** display matched node */
            (!_instance[o].root)
            && (_instance[o].appeared = true)
            && (_instance[o].matched = true);
            return !_instance[o].root;
          });

          (tree.nodes.length)
          && (_observer.canExpand = true)
          && (_observer.canCollapse = true)
          && (_observer.canSearch = true)
          && (_observer.canPick = true);
        });

        function _collectSeed(seeds) {
          var map = {};

          _splitSeed(map, seeds);

          return map;
        }

        function _splitSeed(map, seeds, parent) {
          /** property explanation
           * _id: unique identity
           * root: the _id of the parent node
           * branches: the _id(s) of the children node
           * core: original seed passed from outside
           * level: generation of node
           * matched, aka asleep (alias): determine whether could appear or not (use for searching)
           * appeared: currently appeared node on tree */

          _.forEach(seeds, function (o) {
            /** need to inspect id */
            !(o.id)
            && (console.error('Every single seed requires a specific id!'))
            || (function () {
              var id = (parent || '') + o.id;

              /** generate tree skeleton */
              _skeleton.push(id);

              map[id] = {};
              map[id]._id = id;
              map[id].core = _.cloneDeep(o);
              map[id].level = _.get(map[parent], 'level', rootLevel) + 1;
              map[id].root = parent || null;
              map[id].matched = true;

              /** create children array */
              (parent)
              && (map[parent].branches.push(id));

              /** collect seeds through children */
              _.isArray(o.children)
              && (o.children.length)
              && (map[id].branches = [])
              && (map[id].childMatched = true)
              && (_splitSeed(map, o.children, id));
            })()
          });
        }

        return true;
      }

      function _expand() {
        tree.nodes = _.filter(_skeleton, function (o) {
          /** nodes which marked 'appeared' could be displayed
           * as well as ones 'matched' searching key */
          ((_instance[o].matched) || (_instance[o].childMatched))
          && (_instance[o].appeared = true);

          if (_instance[o].appeared) {
            return true;
          }
        });

        return true;
      }

      function _collapse() {
        tree.nodes = _.filter(_skeleton, function (o) {
          /** only display nodes which don't have root and have appeared */
          return (!_instance[o].root)
            && (_instance[o].matched)
            && (_instance[o].appeared = true)
            || (_instance[o].appeared = false);
        });

        return true;
      }

      function _search(key, sensitive) {
        (_.isString(key))
        && (_doSearch(key, sensitive))
        && (_expand())
        || (console.error('Searching key is not a string!'));

        function _doSearch(key, sensitive) {
          /** clear nodes */
          tree.nodes = [];

          // var found = [];

          /*todo separate searching function into 2 parts*/

          _.forEach(_skeleton, function (o) {
            _instance[o].matched = false;
            _instance[o].childMatched = false;
            _instance[o].appeared = false;
            _instance[o].highlighted = null;

            /** compare required string with node's title */
            var regex = new RegExp(key, sensitive ? 'g' : 'gi'),
              found = _instance[o].core.title.match(regex);
            /** if true, node is matched */
            (_.isArray(found) && found.length)
            && (_instance[o].matched = true);

            (_instance[o].matched)
            && (function () {
              (_instance[o].highlighted = _highlight(_instance[o].core.title, regex));

              var root = o;
              while (root) {
                (_instance[root].root)
                && (_instance[_instance[root].root].childMatched = true);
                root = _instance[root].root;
              }
            })()
          });

          function _highlight(string, regex) {
            return $sce.trustAsHtml(
              string
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(regex, '<span class="highlighted">$&</span>')
            );
          }

          return true;
        }
      }

      function _pick(target) {
        (_.isString(target) && (target !== ''))
        && (_instance[target])
        && ((_instance[target].appeared) || (function () {
          var root = target;
          var roots = [];

          while (root) {
            (_instance[root].root)
            && (roots.unshift(_instance[root].root));
            root = _instance[root].root;
          }

          (roots.length)
          && (_.forEach(roots, function (o) {
            (_instance[o].appeared)
            && (_instance[o].branches)
            && (_instance[o].branches.length)
            && (_expandNode(o))
          }));
        })())
        && (_selectNode(target))
        || (console.log('Node not found!'));
      }

      function _toggleNode(target) {
        var isExpanded = !!(_.filter(_instance[target].branches, function (o) {
          return _instance[o].appeared;
        })).length;

        (!isExpanded)
        && (_expandNode(target))
        || (_collapseNode(target))
      }

      function _findIndex(target) {
        var nodes = _.filter(_skeleton, function (o) {
          return _instance[o].appeared;
        });

        return _.findIndex(nodes, function (o) {
          return o === target;
        });
      }

      function _expandNode(target) {
        var index = _findIndex(target);
        var children = _instance[target].branches || [];

        (!!children.length) && (_.forEach(children, function (child) {
          (!_instance[child].appeared)
          && (function () {
            (_instance[child].matched || _instance[child].childMatched)
            && (function () {
              index++;
              _instance[child].appeared = true;
              tree.nodes.splice(index, 0, child);
            })();
          })()
        }));

        return true;
      }

      function _collapseNode(target) {
        _.remove(tree.nodes, function (node) {
          /** compare _id to remove children and its descendants */
          if ((node !== target) && (_.includes(node, target))) {
            _instance[node].appeared = false;
            return true;
          }
          return false;
        });

        return true;
      }

      function _selectNode(target, execute) {
        /** disabled selected inside referenced node */
        selectedNode && (selectedNode.selected = false);
        /** enabled selected */
        _instance[target].selected = true;
        /** keep reference */
        selectedNode = _instance[target];

        (_.isBoolean(execute) && execute)
        && (_.isFunction(_instance[target].core.onClick))
        && (_instance[target].core.onClick());
      }

      function _maxWidthOfNodes() {
        var max = _.maxBy(tree.nodes, function (node) {
          if (_instance[node].appeared) {
            return _instance[node]['realWidth'];
          }
        });

        if (!_.isUndefined(max)) {
          _.forEach(tree.nodes, function (node) {
            if (_instance[node].appeared) {
              (_instance[max]['realWidth'] > tree.debug.frameWidth())
              && (_instance[node].width = _instance[max]['realWidth'])
              || (_instance[node].width = tree.debug.frameWidth());
            }
          });
        }
      }

      function _getSkeleton() {
        return _skeleton;
      }

      function _getGeneMap() {
        return _geneMap;
      }

      function _getInstance() {
        return _instance;
      }

      function _getNodeState(id) {
        return (id) && (_instance[id]);
      }

      function _setNodeState(id, key, value) {
        (id) && (_instance[id][key] = value);
      }
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
  treeViewCtrl.$inject = ['$timeout', '$sce'];

  ng.module('treeViewLight', ['ngSanitize']);

  ng.module('treeViewLight')
    .constant('treeViewConst', treeViewConst);

  ng.module('treeViewLight')
    .directive('treeViewLight', treeView)
    .controller('TreeViewLightCtrl', treeViewCtrl);

})(window.angular, window._);