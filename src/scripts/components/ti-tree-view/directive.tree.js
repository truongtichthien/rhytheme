/**
 * Created by Administrator on 7/7/17.
 */

(function (ng, _) {
  'use strict';

  var treeViewConst = {
    pxRemRatio: 10
  };

  function treeView(_timeout) {
    var tree;
    tree = {
      restrict: 'EA',
      scope: {
        /** 'nodes' contains the id of nodes which appear currently on tree */
        nodes: '=?',
        /** use the ready function to define all tools/apis
         * that will be triggerred once directive renders completely */
        ready: '&?'
      },
      templateUrl: 'scripts/components/ti-tree-view/view.tree.html',
      link: function (scope, element) {
        treeViewLink(_timeout, scope, element);
      },
      controller: 'treeViewCtrl',
      controllerAs: 'tree',
      bindToController: true
    };
    return tree;
  }

  function treeViewCtrl(_sce) {
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

      (_.isUndefined(tree.ready))
      && (function () {
        console.info('You should define a onComponentLoad function passed by \'ready\' attribute');
        return true;
      })()
      || (function () {
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
        tree.tools.disable = _disableNode;
        tree.tools.getNode = _getNodeState;
        tree.tools.getSelected = _getSelected;
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
        /** tree.debug.frameWidth // re-define in link function */
      })();

      function _build(seeds) {
        var rootLevel = -1, tmp;

        _skeleton = [];
        _geneMap = _collectSeed(seeds);
        _instance = _.cloneDeep(_geneMap);
        /** mark necessary properties for nodes */
        tmp = _.filter(_skeleton, function (o) {
          /** display matched node */
          (!_instance[o].root)
          && (_instance[o].appeared = true)
          && (_instance[o].matched = true);
          return !_instance[o].root;
        });

        /** console.info('skeleton ', _skeleton);
         * console.info('gene map ', _geneMap);
         * console.info('instance ', _instance); */

        /** re-assign tree.nodes to force ng-repeat renders nodes */
        tree.nodes = tmp;

        (tree.nodes.length)
        && (_observer.canExpand = true)
        && (_observer.canCollapse = true)
        && (_observer.canSearch = true)
        && (_observer.canPick = true);

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
           * disabled: put node in disabled state
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
              map[id].disabled = false;

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

        return tree.tools;
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

        return tree.tools;
      }

      function _collapse() {
        tree.nodes = _.filter(_skeleton, function (o) {
          /** only display nodes which don't have root and have appeared */
          return (!_instance[o].root)
            && (_instance[o].matched)
            && (_instance[o].appeared = true)
            || (_instance[o].appeared = false);
        });

        return tree.tools;
      }

      function _search(key, sensitive) {
        (_.isString(key))
        && (_doSearch(key, sensitive))
        && (_expand())
        || (console.error('Searching key is not a string!'));

        function _doSearch(key, sensitive) {
          /** clear nodes */
          tree.nodes = [];

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
            return _sce['trustAsHtml'](
              string
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(regex, '<span class="highlighted">$&</span>')
            );
          }

          return true;
        }

        return tree.tools;
      }

      function _pick(target) {
        (_.isString(target) && (target !== ''))
        && (_instance[target])
        && ((_instance[target].appeared) || (function expandRootFn() {
          var root = target;
          var roots = [];

          while (root) {
            (_instance[root].root)
            && (roots.unshift(_instance[root].root));
            root = _instance[root].root;
          }

          (roots.length)
          && (_.forEach(roots, function forEachFn(o) {
            (_instance[o].appeared)
            && (_instance[o].branches)
            && (_instance[o].branches.length)
            && (_expandNode(o))
          }));

          return true;
        })())
        && (function selectNodeFn() {
          _selectNode(target);
          return true;
        })()
        || (console.log('Node ' + target + ' not found!'));

        return tree.tools;
      }

      function _toggleNode(target) {
        var isExpanded = !!(_.filter(_instance[target].branches, function (o) {
          return _instance[o].appeared;
        })).length;

        (!isExpanded)
        && (_expandNode(target))
        || (_collapseNode(target));

        return true;
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
        (!_instance[target].disabled)
        && (function selectFn() {
          /** disabled selected inside referenced node */
          selectedNode
          && (selectedNode.selected = false);
          /** enabled selected */
          _instance[target].selected = true;
          /** keep reference */
          selectedNode = _instance[target];

          /** trigger onClick function if needed */
          (_.isBoolean(execute) && execute)
          && (_.isFunction(_instance[target].core.onClick))
          && (_instance[target].core.onClick());
        })();

        return true;
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

      function _getSelected() {
        return selectedNode;
      }

      function _getNodeState(id) {
        return (_instance)
          && (id)
          && (_instance[id]);
      }

      function _setNodeState(id, key, value) {
        (id)
        && (_instance)
        && (_instance[id])
        && (_instance[id][key] = value);
      }

      /** an advanced function to disable node */
      function _disableNode(id) {
        _setNodeState(id, 'disabled', true);
        _setNodeState(id, 'selected', false);

        return tree.tools;
      }
    }
  }

  function treeViewLink(_timeout, scope, element) {
    var tree = scope.tree;

    (_.isUndefined(tree.ready))
    || (function linkFn() {
      /** re-define frameWidth function */
      tree.debug.frameWidth = _treeFrameWidth;

      /** use $timeout to ensure tree rendering completed */
      _timeout(function timeoutFn() {
        /** calculate the width of the tree */
        _treeFrameWidth();
        /** trigger callback function */
        /** ======HIGHLY IMPORTANT====== */
        tree.ready({ api: tree.tools });
        /** ============================ */
      });
    })();

    function _treeFrameWidth() {
      /** todo: calculate frame's width once window triggers onResize */
      return element
        .find('.repeat-wrapper')[0]
        .clientWidth;
    }
  }

  treeView.$inject = ['$timeout'];
  treeViewCtrl.$inject = ['$sce'];

  ng.module('tiTreeViewModule', ['ngSanitize']);

  ng.module('tiTreeViewModule')
    .constant('treeViewConst', treeViewConst);

  ng.module('tiTreeViewModule')
    .directive('treeView', treeView)
    .controller('treeViewCtrl', treeViewCtrl);

})(window.angular, window._);