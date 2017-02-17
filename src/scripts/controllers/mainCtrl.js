(function (ng) {
  'use strict';

  function mainCtrl($http) {
    var vm = this;

    vm.getData = getData;
    vm.getString = getString;
    vm.postData = postData;

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

  mainCtrl.$inject = ['$http'];

  ng.module('sampleApp')
    .controller('MainCtrl', mainCtrl);
})(angular);