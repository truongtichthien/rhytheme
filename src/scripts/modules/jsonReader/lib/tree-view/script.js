/**
 * $Id: $
 * (c) Copyright ALE USA Inc., 2015
 * All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 * or transmitted in any form or by any means, electronic, mechanical,
 * photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function () {
  'use strict';

  function _createRandomName() {
    var i, TEXT_LENGTH = 15,
      text = '',
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      POSSIBLE_LENGTH = possible.length;

    for (i = 0; i < TEXT_LENGTH; i++) {
      text += possible.charAt(Math.floor(Math.random() * POSSIBLE_LENGTH));
    }

    return text;
  }

  function APIProvider($q, ovDottie, ovHttp, notificationsService) {
    var notificationDefinitionAPI = notificationsService.common.getSingleWithoutStatus(ovHttp.proxy('api/notifications/trapdefinitions')),
      edgeProfileAPI = notificationsService.common.getSingleWithoutStatus(ovHttp.proxy('api/ag/edgeprofile')),
      deferred, data;

    function _thousandRowsData() {
      deferred = $q.defer();
      data = [];

      notificationDefinitionAPI.execute()
        .then(
        angular.noop,
        function (error) {
          data.length = 0;
          deferred.reject(error);
        },
        function (response) {
          var list = ovDottie.getArray(response, 'response.trapDefinitions');
          if (list.length > 0) {
            angular.forEach(list, function (item) {
              data.push({
                id: item.name + item.oid,
                title: item.name,
                parent: {},
                menuItems: [],
                isShowing: false
              });
            });
          }

          deferred.resolve(data);
        })
        .finally();

      return deferred.promise;
    }

    function _fewRowsData() {
      deferred = $q.defer();
      data = [];

      edgeProfileAPI.execute()
        .then(
        angular.noop,
        function (error) {
          data.length = 0;
          deferred.reject(error);
        },
        function (response) {
          var resp = ovDottie.getArray(response, 'response');

          if (resp.length > 0) {
            angular.forEach(resp, function (item) {
              data.push({
                id: item.profileName,
                title: item.profileName,
                parent: {},
                menuItems: []
              });
            });
          }

          deferred.resolve(data);
        })
        .finally();

      return deferred.promise;
    }

    return {
      fewRowsData: _fewRowsData,
      thousandRowsData: _thousandRowsData
    };
  }

  function SeedProvider(ovDottie) {
    var LEVEL = 3;

    function _showTitle(title) {
      console.log('run callback function of ' + title);
    }

    function _createParent() {
      return {
        title: _createRandomName(),
        id: 'parent_' + _createRandomName(),
        callback: function () {
          _showTitle(this.title);
        },
        menuItems: []
      };
    }

    function _createChild(item) {
      if (ovDottie.getNumber(item, 'menuItems.length') > 0) {
        angular.forEach(item.menuItems, function (child) {
          _createChild(child);
        });
      } else {
        var i, len = Math.floor(Math.random() * 5),
          obj = {
            callback: function () {
              _showTitle(this.title);
            },
            parent: item,
            menuItems: []
          };

        for (i = 1; i <= len; i++) {
          obj.id = 'child_' + i;
          obj.title = _createRandomName();

          item.menuItems.push(angular.copy(obj));
        }
      }
    }

    function _createGeneration() {
      var l, parent = _createParent();
      for (l = 0; l < LEVEL; l++) {
        _createChild(parent);
      }

      return parent;
    }

    return {
      createParent: _createParent,
      createGeneration: _createGeneration
    };
  }

  function OvViewDemoService() {
    var serv = {};
    serv.ovTreeViewObj = {};

    return serv;
  }

  function OvTreeViewDemoController(OvTreeViewDemoService, SeedProvider, APIProvider, ovDottie) {
    var vm = this,
      config = {
        maxHeight: 60, // unit: rem
        showCheckbox: true,
        isChecklist: true,
        enableDragDrop: false
      };

    /** synchronize ovTreeViewObj with the one on OvViewDemoService service */
    vm.ovTreeViewObj = OvTreeViewDemoService.ovTreeViewObj;
    vm.disabledRebuild = {};
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

    /** add more properties into ovTreeViewObj if they aren't existed */
    if (angular.isUndefined(vm.ovTreeViewObj.seedArray)) {
      vm.ovTreeViewObj.seedArray = [];
    }
    if (angular.isUndefined(vm.ovTreeViewObj.config)) {
      vm.ovTreeViewObj.config = config;
    }
    if (angular.isUndefined(vm.ovTreeViewObj.searchObject)) {
      vm.ovTreeViewObj.searchObject = {};
    }
    if (angular.isUndefined(vm.ovTreeViewObj.controlFunction)) {
      vm.ovTreeViewObj.controlFunction = {};
    }
    if (angular.isUndefined(vm.ovTreeViewObj.lastScrollTop)) {
      vm.ovTreeViewObj.lastScrollTop = {};
    }

    /** the function is used to create the data for seedArray */
    function _createSeedArray() {
      var parent1, childParent1 = [],
        parent2, childParent2 = [],
        parent3, childParent3 = [];

      /** generate parent1 with no children
       * then, create childParent1[0] with no children but has the function which call API to get children from server
       * finally, push childParent1[0] into parent1.menuItems, from now parent1 has one child */
      parent1 = SeedProvider.createParent();
      childParent1[0] = SeedProvider.createParent();
      childParent1[0].addMenuItems = function () {
        return APIProvider.thousandRowsData();
      };
      parent1.menuItems.push(childParent1[0]);

      /** generate parent2 which contains many levels of inheritance
       * then, create 2 more children and push them into parent2 */
      parent2 = SeedProvider.createGeneration();
      childParent2[0] = SeedProvider.createGeneration();
      childParent2[1] = SeedProvider.createGeneration();

      parent2.menuItems.push(childParent2[0]);
      parent2.menuItems.push(childParent2[1]);

      /** do parent3 exactly the steps what have done parent2 */
      parent3 = SeedProvider.createGeneration();
      childParent3[0] = SeedProvider.createGeneration();
      childParent3[1] = SeedProvider.createGeneration();

      //parent3.menuItems.push(childParent3[0]);
      //parent3.menuItems.push(childParent3[1]);

      /** push all parents into ovTreeViewObj.seedArray */
      vm.ovTreeViewObj.seedArray.length = 0;
      vm.ovTreeViewObj.seedArray.push(parent1);
      vm.ovTreeViewObj.seedArray.push(parent2);
      vm.ovTreeViewObj.seedArray.push(parent3);
    }

    /** check if seedArray is undefined or has length equal zero or not, then create new data for seedArray */
    if (ovDottie.getNumber(vm.ovTreeViewObj, 'seedArray.length') === 0) {
      _createSeedArray();

      //var json = {
      //  statusCode: 200,
      //  restVersion: 'v1',
      //  message: 'com.tma.ov.tool.trackingtool.rest.messages.success',
      //  additionalData: {},
      //  data: {
      //    release: '4.1.2',
      //    letterBuild: 'R02',
      //    featureCode: 4077,
      //    featureName: 'Auto-Discovery Support',
      //    checkList: [
      //      {
      //        taskId: '56d90431-d6d7-480c-bd2f-dfd48d39fae9',
      //        taskName: 'Requirements Analysis',
      //        ordinal: 1,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'fa9c52bf-fe60-4bab-bd9d-15321031ed12',
      //        taskName: 'Draft SFS',
      //        ordinal: 2,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'bb79476d-131c-4530-99ff-a41d54c373bd',
      //        taskName: 'Task breakdown & Feature Estimation',
      //        ordinal: 3,
      //        done: true,
      //        childTask: []
      //      },
      //      {
      //        taskId: '0b2f93b9-1c69-4499-bec0-7d1a333e8d13',
      //        taskName: 'Estimation Review',
      //        ordinal: 4,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '00e69319-868d-4ea2-b426-236a700019b1',
      //        taskName: 'Drawing Mockup',
      //        ordinal: 5,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'dbbe87ff-b68f-4440-b756-fbd25d8ff8c3',
      //        taskName: 'Code Design/Solution',
      //        ordinal: 6,
      //        done: false,
      //        childTask: [
      //          {
      //            taskId: '833dc960-4525-4ce2-b301-c8404931ffff',
      //            taskName: 'DB Migration/Upgrade Check',
      //            ordinal: 1,
      //            done: false,
      //            childTask: []
      //          },
      //          {
      //            taskId: '65dcfbb3-160e-481f-a7f7-421dd68a3ad3',
      //            taskName: 'UI Upgrade Check',
      //            ordinal: 2,
      //            done: false,
      //            childTask: []
      //          },
      //          {
      //            taskId: '289caf53-c20c-403f-a796-ee29f236826f',
      //            taskName: 'REST API Versioning Check',
      //            ordinal: 3,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: 'bd37d4a7-2c84-4cc9-b8ff-e0ce69608eb8',
      //            taskName: 'Code Design',
      //            ordinal: 4,
      //            done: false,
      //            childTask: []
      //          }
      //        ]
      //      },
      //      {
      //        taskId: '7b4636da-a78c-4f1f-9c94-7f56fcf1b175',
      //        taskName: 'Code Design Review',
      //        ordinal: 7,
      //        done: true,
      //        childTask: []
      //      },
      //      {
      //        taskId: '079bf35f-32ec-4d2d-89ff-3d105a21cf47',
      //        taskName: 'Code implementation/JUT/JSUT',
      //        ordinal: 8,
      //        done: true,
      //        childTask: [
      //          {
      //            taskId: '31bfe547-da58-476f-93cc-aef9cfb0339c',
      //            taskName: 'Server Implementation',
      //            ordinal: 1,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: '5f7e19f5-0c41-4480-b079-4b61a2064fed',
      //            taskName: 'JUT',
      //            ordinal: 2,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: '004e270f-8ccf-4aab-a955-79c23c68064c',
      //            taskName: 'Server Code Review (by feature prime/team members)',
      //            ordinal: 3,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: 'be749854-5933-4fd8-b4e8-86eefbdf95ea',
      //            taskName: 'UI Implementation',
      //            ordinal: 4,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: '53405d57-1e97-4719-8d1a-808564ed5e2a',
      //            taskName: 'JSUT',
      //            ordinal: 5,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: '0d4e6bfa-4933-435d-9952-ce83d12d57f8',
      //            taskName: 'UI Code Review (by feature prime/team members)',
      //            ordinal: 6,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: 'aea2b795-7b8b-4481-96e4-daea83afb214',
      //            taskName: 'UI-Server Integration',
      //            ordinal: 7,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: '0ad2d6d5-2683-4873-9e1e-fa721d13a6a7',
      //            taskName: 'Writing BASIC WORK FLOW Unit test cases (Including System Integration)',
      //            ordinal: 8,
      //            done: true,
      //            childTask: []
      //          },
      //          {
      //            taskId: '339d5c7b-9824-44c9-93cf-5dc21fce2e91',
      //            taskName: 'Executing BASIC WORK FLOW Unit Test Cases',
      //            ordinal: 9,
      //            done: true,
      //            childTask: []
      //          }
      //        ]
      //      },
      //      {
      //        taskId: 'c15d9a54-5a26-40eb-a9e4-4b3546d506f3',
      //        taskName: 'Code Review by Dev primes',
      //        ordinal: 9,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '538a6ed3-34ab-4ba4-995b-0c751b2e588b',
      //        taskName: 'Continue writing Unit Test Cases',
      //        ordinal: 10,
      //        done: true,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'dd3d82a6-bbb0-405c-94ce-cecac68fb344',
      //        taskName: 'Update Draft SFS (if needed)',
      //        ordinal: 11,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'e6beed61-e86c-4c3a-ae2f-1f9348511bf2',
      //        taskName: 'Offical SFS Review',
      //        ordinal: 12,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '4f95d275-1cd6-4979-853e-2ef102d2434d',
      //        taskName: 'Executing Unit Test Cases',
      //        ordinal: 13,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'a12c613a-343b-437e-b0dc-df298edb0ccf',
      //        taskName: '100% UTs Passed',
      //        ordinal: 14,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '2219bad5-0f43-4dde-8801-40e53438295a',
      //        taskName: 'REST APIs Document',
      //        ordinal: 15,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '9f63177b-cad5-45a7-993e-60df7a134b77',
      //        taskName: 'Finalizing SFS',
      //        ordinal: 16,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: 'c899730c-3332-419a-9d33-3edeb363dfb8',
      //        taskName: 'Code Coverage Report',
      //        ordinal: 17,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '56139e2b-5258-49a6-bd04-ffe938edcec7',
      //        taskName: 'SFS Approval',
      //        ordinal: 18,
      //        done: false,
      //        childTask: []
      //      },
      //      {
      //        taskId: '75199e5e-ae90-4496-ac34-342c9637e562',
      //        taskName: 'Code Complete',
      //        ordinal: 19,
      //        done: false,
      //        childTask: []
      //      }
      //    ]
      //  }
      //}, array;

      //array = ovDottie.getArray(json, 'data.checkList');

      //angular.forEach(array, function (item) {
      //  vm.ovTreeViewObj.seedArray.push(item);
      //});
    }

    /** vm.disabledRebuild is used to disable rebuild button on screen
     * vm.changeData is used to create the new seedArray */
    vm.disabledRebuild.value = true;
    vm.changeData = function () {
      _createSeedArray();

      /** disable rebuild button */
      vm.disabledRebuild.value = false;
    };
  }

  APIProvider.$inject = ['$q', 'ovDottie', 'ovHttp', 'notificationsService'];
  SeedProvider.$inject = ['ovDottie'];
  OvViewDemoService.$inject = [];
  OvTreeViewDemoController.$inject = ['OvTreeViewDemoService', 'SeedProvider', 'APIProvider', 'ovDottie'];

  angular
    .module('treeView')
    .factory('APIProvider', APIProvider)
    .factory('SeedProvider', SeedProvider)
    .factory('OvTreeViewDemoService', OvViewDemoService)
    .controller('OvTreeViewDemoCtrl', OvTreeViewDemoController);
})();
