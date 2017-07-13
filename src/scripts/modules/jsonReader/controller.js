/**
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function (ng) {
  'use strict';

  function JReaderController($timeout, scope) {
    var vm = this,
      _resultObj = {},
      localResultObj = {};

    // vm.nodes = [];
    // vm.tools = {};
    vm.search = {
      key: ''
    };
    vm.node = {
      id: ''
    };
    vm.seeds = [
      {
        id: 'parentZero',
        title: 'Parent Zero',
        children: [
          { id: 'alpha', title: 'Alpha' },
          { id: 'bravo', title: 'Bravo' }
        ]
      },
      {
        id: 'parentOne',
        title: 'Parent One',
        children: [
          { id: 'charlie', title: 'Charlie' },
          {
            id: 'delta',
            title: 'Delta',
            children: [
              { id: 'golf', title: 'Golf' },
              { id: 'hotel', title: 'Hotel' }
            ]
          }
        ]
      }
    ];

    $timeout(function () {
      vm.seeds.push({
        id: 'parentTwo',
        title: 'Parent Two',
        children: [
          { id: 'echo', title: 'Echo Echo Echo Echo Echo Echo' },
          { id: 'foxtrot', title: 'Foxtrot Foxtrot Foxtrot Foxtrot Foxtrot Foxtrot' }
        ]
      });
    }, 100);

    // vm.seeds.length = 0;

    vm.jsonObj = {};
    vm.jsonObj.seedArray = [
      {
        id: 'Object',
        title: 'Object',
        typeLabel: 'Object',
        menuItems: [],
        rootObj: true
      }
    ];
    vm.jsonObj.config = {
      nodeItemTpl: 'lib/tree-view/directive/template/customNodeItem.html',
      maxHeight: 30 // unit: rem
    };
    vm.jsonObj.searchObject = {};
    vm.jsonObj.controlFunction = {};
    vm.jsonObj.lastScrollTop = {};

    vm.ovTreeViewFuncButtonConfig = {
      expand: {
        method: 'expandAll',
        btnClass: 'btn-primary'
      },
      collapse: {
        method: 'collapseAll',
        btnClass: 'btn-info'
      },
      rebuild: {
        method: 'rebuildTree',
        btnClass: 'btn-danger',
        disabled: vm.disabledRebuild
      }
    };

    vm.fileInput = undefined;
    vm.minOccurrence = 0;
    vm.maxOccurrence = 10;

    scope.$watch('vm.fileInput', function (newVal) {
      _readFileContent(newVal);
    });

    vm.countValueOccurrence = function () {
      _filterProperty(_resultObj);
    };

    function _readFileContent(text) {
      if (angular.isDefined(text) && text !== '') {
        var convertedText;

        _resultObj = {};
        convertedText = text;

        /** replace each backslash characters with a pair of backslash
         * to keep the "\" character will be showed as a string */
        convertedText = convertedText.replace(/\\/g, '\\\\');

        /** put one more backslash before each one followed by a special character */
        convertedText = convertedText.replace(/(\\)([-!$%^&*()#_+|~=`\[\]:"”{}@;'<>?,.\/])/g, '\\$&');

        /** parse string to JSON */
        convertedText = JSON.parse(convertedText);

        /**  */
        _createJsonPath(convertedText);

        _filterProperty(_resultObj);
      }
    }

    function _createJsonPath(val, rootPath) {
      var k, path;

      if (angular.isObject(val)) {
        if (angular.isArray(val)) {
          var i, len;
          for (i = 0, len = val.length; i < len; i++) {
            _createJsonPath(val[i], rootPath + '[' + i + ']');
          }
        } else {
          for (k in val) {
            if (val.hasOwnProperty(k)) {
              path = rootPath ? rootPath + '.' : '';
              path = path + k;

              /**  */
              val[k] = val[k] === '' ? '\"\"' : val[k];

              /**  */
              _createJsonPath(val[k], path);
            }
          }
        }
      } else {
        /** what you want to do with each path line
         store both path line and val to count the occurrence of each properties */
        _resultObj[val] = _resultObj[val] || [];

        /**  */
        _resultObj[val].push({
          id: _resultObj[val].length,
          title: '\"' + rootPath + '\"',
          menuItems: []
        });

        localResultObj[val] = localResultObj[val] || [];
        localResultObj[val].push(rootPath);
      }
    }

    function _filterProperty(obj) {
      var k, result = [];
      vm.jsonObj.seedArray[0].menuItems.length = 0;
      // vm.jsonObj.seedArray.length = 0;

      for (k in obj) {
        if (obj.hasOwnProperty(k)) {
          if (obj[k].length >= vm.minOccurrence && obj[k].length <= vm.maxOccurrence) {
            result.push({
              id: k,
              title: k,
              typeLabel: 'Array',
              menuItems: obj[k]
            });

            localResultObj[k] = angular.copy(localResultObj[k]);
          }
        }
      }
      vm.jsonObj.seedArray[0].menuItems = angular.copy(result);
      // vm.jsonObj.seedArray = angular.copy(result);
    }
  }

  JReaderController.$inject = ['$timeout', '$scope'];

  function fileInput() {
    return {
      scope: {
        fileInput: '='
      },
      link: function (scope, element) {
        element.bind('change', function (changeEvent) {
          var reader = new FileReader(),
            file = changeEvent.target.files[0],
            text;

          reader.onload = function (loadEvent) {
            text = loadEvent.target.result;
            scope.$apply(function () {
              scope.fileInput = text;
            });
          };

          if (file) {
            reader.readAsText(file);
          }
        });
      }
    };
  }

  fileInput.$inject = [];

  ng.module('jsonReaderApp')
    .controller('JReaderController', JReaderController)
    .directive('fileInput', fileInput);

})(angular);


