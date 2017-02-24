(function (ng) {
  'use strict';

  function ovFullScreenCtrl($scope, $window, $timeout, $compile) {
    var vm = this;
    // var anchorEle = ng.element('.ov-full-screen-anchor'),
    //   windowEle = ng.element($window);
    //
    // var anchorEleTop = anchorEle[0].offsetTop;
    // var anchorEleLeft = anchorEle[0].offsetLeft;
    // var anchorEleWidth = anchorEle[0].offsetWidth;
    // var anchorEleHeight = anchorEle[0].offsetHeight;
    //
    // var windowEleWidth = windowEle[0].innerWidth;
    // var windowEleHeight = windowEle[0].innerHeight;
    //
    // var anchorEleMarginBottom = parseInt(anchorEle.css('margin-bottom').replace('px', ''));
    //
    // vm.fullScreenIsOpen = false;
    // vm.showFullScreen = showFullScreen;
    // vm.hideFullScreen = hideFullScreen;
    //
    // var newScope;
    //
    // function showFullScreen() {
    //   vm.fullScreenIsOpen = true;
    //   newScope = $scope.$new(true, $scope);
    //
    //   ng.element('body')
    //     .append($compile('<div style="top: ' + (anchorEleTop - 50) + 'px; left: ' + (anchorEleLeft - 10) + 'px; height: ' + (anchorEleHeight + 60) + 'px; width: ' + (anchorEleWidth + 20) + 'px " class="ov-full-screen-backdrop">' +
    //       '<div class="pull-right ov-full-screen-remove-icon">' +
    //       '<i class="glyphicon glyphicon-remove" ng-click="$parent.ov.hideFullScreen()"></i>' +
    //       '</div>' +
    //       '</div>')(newScope));
    //
    //   ng.element('.ov-full-screen-anchor')
    //     .css({
    //       position: 'fixed',
    //       top: anchorEleTop,
    //       left: anchorEleLeft,
    //       bottom: windowEleHeight - (anchorEleTop + anchorEleHeight + anchorEleMarginBottom),
    //       right: windowEleWidth - (anchorEleLeft + anchorEleWidth)
    //     });
    //
    //   $timeout(function () {
    //     ng.element('.ov-full-screen-anchor')
    //       .addClass('floating');
    //
    //     ng.element('.ov-full-screen-backdrop')
    //       .addClass('full-screen');
    //   });
    // }
    //
    // function hideFullScreen() {
    //   vm.fullScreenIsOpen = false;
    //
    //   ng.element('.ov-full-screen-backdrop')
    //     .removeClass('full-screen');
    //   ng.element('.ov-full-screen-anchor')
    //     .css({
    //       top: anchorEleTop,
    //       left: anchorEleLeft,
    //       bottom: windowEleHeight - (anchorEleTop + anchorEleHeight + anchorEleMarginBottom),
    //       right: windowEleWidth - (anchorEleLeft + anchorEleWidth)
    //     });
    //
    //   $timeout(function () {
    //     ng.element('.ov-full-screen-backdrop')
    //       .remove();
    //     newScope.$destroy();
    //     newScope = undefined;
    //
    //     ng.element('.ov-full-screen-anchor')
    //       .css({
    //         position: '',
    //         top: '',
    //         left: '',
    //         bottom: '',
    //         right: ''
    //       })
    //   }, 300);
    //
    //   $timeout(function () {
    //     ng.element('.ov-full-screen-anchor')
    //       .removeClass('floating')
    //   });
    // }

  }

  ovFullScreenCtrl.$inject = ['$scope', '$window', '$timeout', '$compile'];

  ng.module('sampleApp')
    .controller('OvFullScreenCtrl', ovFullScreenCtrl);
})(angular);