/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function mainCtrl($http, $location) {
    var vm = this;
    vm.menu = '';

    vm.saveModal = saveModal;
    vm.getData = getData;
    vm.getString = getString;
    vm.postData = postData;

    vm.activateMenu = activateMenu;

    vm.activateMenu('#' + $location.path());

    function activateMenu(e) {
      vm.menu = ng.isString(e) ? e : e.target.hash;
    }

    function saveModal(string, e) {
      console.log(string, e);
    }

    function getData() {
      $http({
        method: 'GET',
        url: '/api/get'
      })
        .then(
          function successCallback(successRes) {
            // console.log(successRes);
            var data = successRes.data;
            console.log(data);
          }, function errorCallback(errorRes) {
            console.log(errorRes);
          }
        );
    }

    function getString() {
      $http({
        method: 'GET',
        url: '/api/getString'
      })
        .then(
          function successCallback(successRes) {
            // console.log(successRes);
            var data = successRes.data;
            console.log(data);
          }, function errorCallback(errorRes) {
            console.log(errorRes);
          }
        );
    }

    function postData() {
      $http({
        method: 'POST',
        url: '/api/post',
        data: {
          string: 'abc'
        }
      }).then(
        function (res) {
          console.log('response ', res);
        },
        function (error) {
          console.log('error ', error);
        }
      );
    }
  }

  mainCtrl.$inject = ['$http', '$location'];

  ng.module('rhythemeModule')
    .controller('MainCtrl', mainCtrl);

})(window.angular);