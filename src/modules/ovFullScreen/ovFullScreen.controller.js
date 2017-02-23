(function (ng) {
  'use strict';

  function ovFullScreenCtrl($scope, $timeout, $compile) {
    var vm = this;
    vm.showFullScreen = showFullScreen;
    vm.hideFullScreen = hideFullScreen;

    function showFullScreen() {
      var fullScreenIcon = ng.element('.ov-full-screen-anchor');

      var top = fullScreenIcon[0].offsetTop;
      var left = fullScreenIcon[0].offsetLeft;
      var width = fullScreenIcon[0].offsetWidth;
      var height = fullScreenIcon[0].offsetHeight;

      console.log(top, left, height, width);

      ng.element('body')
        .append($compile('<div style="top: ' + (top - 50) + 'px; left: ' + (left - 10) + 'px; height: ' + (height + 20) + 'px; width: ' + (width + 60) + 'px " class="ov-full-screen-backdrop">' +
          '<div class="pull-right ov-full-screen-remove-icon">' +
          '<i class="glyphicon glyphicon-remove" ng-click="ov.hideFullScreen()"></i>' +
          '</div>' +
          '</div>')($scope));

      $timeout(function () {
        ng.element('.ov-full-screen-anchor')
          .addClass('floating')
          .css({top: top, left: left, width: width, height: height});

        ng.element('.ov-full-screen-backdrop')
          .addClass('full-screen');
      });
    }

    function hideFullScreen() {
      ng.element('.ov-full-screen-backdrop')
        .removeClass('full-screen');

      $timeout(function () {
        ng.element('.ov-full-screen-backdrop')
          .remove();
        ng.element('.ov-full-screen-anchor')
          .removeClass('floating')
      }, 600);
    }

  }

  ovFullScreenCtrl.$inject = ['$scope', '$timeout', '$compile'];

  ng.module('sampleApp')
    .controller('OvFullScreenCtrl', ovFullScreenCtrl);
})(angular);