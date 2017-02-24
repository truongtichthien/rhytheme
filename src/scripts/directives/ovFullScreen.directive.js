(function (ng) {
  'use strict';

  function ovFullScreenDirectiveCtrl($scope, $window, $timeout, $compile) {
    var vm = this,
      childScope;

    // var anchorEle = ng.element('.ov-full-screen-anchor'),
    //   windowEle = ng.element($window);

    var anchorEle;
    var windowEle = ng.element($window);

    var anchorEleTop, anchorEleLeft, anchorEleWidth, anchorEleHeight;

    var windowEleWidth, windowEleHeight;

    var anchorEleMarginTop, anchorEleMarginRight, anchorEleMarginBottom, anchorEleMarginLeft;

    vm.fullScreenIsOpen = false;

    vm.showFullScreen = _showFullScreen;
    vm.hideFullScreen = _hideFullScreen;

    _calculateViewPortDimension();
    vm.calculateElementDimension = _calculateElementDimension;

    ng.element($window).resize(_.debounce(
      function () {
        _calculateViewPortDimension();
        _calculateElementDimension();
      }, 100));

    function _calculateViewPortDimension() {
      windowEleWidth = windowEle[0].innerWidth;
      windowEleHeight = windowEle[0].innerHeight;
    }

    function _calculateElementDimension(ele) {
      anchorEle = ele || anchorEle;

      anchorEleTop = anchorEle[0].offsetTop;
      anchorEleLeft = anchorEle[0].offsetLeft;
      anchorEleWidth = anchorEle[0].offsetWidth;
      anchorEleHeight = anchorEle[0].offsetHeight;

      anchorEleMarginTop = parseInt(anchorEle.css('margin-top').replace('px', ''));
      anchorEleMarginRight = parseInt(anchorEle.css('margin-right').replace('px', ''));
      anchorEleMarginBottom = parseInt(anchorEle.css('margin-bottom').replace('px', ''));
      anchorEleMarginLeft = parseInt(anchorEle.css('margin-left').replace('px', ''));
    }

    function _showFullScreen() {

      /** generate a new child scope */
      childScope = $scope.$new(true);
      /** then define only necessary functions */
      childScope.hideFullScreen = vm.hideFullScreen;
      /** listen $destroy on child scope */
      childScope.$on('$destroy', function () {
        console.info('destroy childScope');
      });

      vm.fullScreenIsOpen = true;

      ng.element('body')
        .append($compile('' +
          '<div style="' +
          'top: ' + (anchorEleTop - 50) + 'px;' +
          'left: ' + (anchorEleLeft - 10) + 'px;' +
          'width: ' + (anchorEleWidth + 20) + 'px;' +
          'height: ' + (anchorEleHeight + 60) + 'px " class="ov-full-screen-backdrop">' +
          '<div class="pull-right ov-full-screen-remove-icon">' +
          '<i class="glyphicon glyphicon-remove" ng-click="hideFullScreen()"></i></div></div>')(childScope));

      anchorEle
        .css({
          position: 'fixed',
          top: anchorEleTop - anchorEleMarginTop,
          right: windowEleWidth - (anchorEleLeft + anchorEleWidth + anchorEleMarginRight),
          bottom: windowEleHeight - (anchorEleTop + anchorEleHeight + anchorEleMarginBottom),
          left: anchorEleLeft - anchorEleMarginLeft
        });

      $timeout(function () {
        ng.element('.ov-full-screen-anchor')
          .addClass('floating');

        ng.element('.ov-full-screen-backdrop')
          .addClass('full-screen');
      });
    }

    function _hideFullScreen() {
      vm.fullScreenIsOpen = false;

      ng.element('.ov-full-screen-backdrop')
        .removeClass('full-screen');

      anchorEle
        .css({
          top: anchorEleTop - anchorEleMarginTop,
          right: windowEleWidth - (anchorEleLeft + anchorEleWidth + anchorEleMarginRight),
          bottom: windowEleHeight - (anchorEleTop + anchorEleHeight + anchorEleMarginBottom),
          left: anchorEleLeft - anchorEleMarginLeft
        });

      $timeout(function () {
        ng.element('.ov-full-screen-backdrop')
          .remove();

        /** destroy generated child scope */
        childScope.$destroy();
        childScope = undefined;

        anchorEle
          .css({
            position: '',
            top: '',
            right: '',
            bottom: '',
            left: ''
          })
      }, 300);

      $timeout(function () {
        anchorEle
          .removeClass('floating')
      });
    }
  }

  function _findParent(element) {
    var parent = element.parent();
    var classList = parent[0].classList.value;

    if (classList.indexOf('ov-full-screen-anchor') >= 0 || parent[0].tagName === 'BODY') {
      return parent;
    } else {
      return _findParent(parent);
    }
  }

  function ovFullScreenDirectiveLink(scope, element) {
    var anchorEle;

    var classList = element[0].classList.value,
      targetEle;
    if (classList.indexOf('ov-full-screen-anchor') >= 0) {
      targetEle = element;
    } else {
      targetEle = _findParent(element);
    }

    if (targetEle[0].tagName === 'BODY') {
      console.error('The element with class .ov-full-screen-anchor could not found!');
    } else {
      anchorEle = targetEle;
    }

    scope.vm.calculateElementDimension(anchorEle);
  }

  function ovFullScreenDirective($window) {
    var directive;

    directive = {
      restrict: 'EA',
      scope: {
        api: '?='
      },
      controller: ovFullScreenDirectiveCtrl,
      controllerAs: 'vm',
      templateUrl: 'scripts/directives/ovFullScreen.directive.html',
      link: function (scope, element) {
        ovFullScreenDirectiveLink($window, scope, element);
      }
    };

    return directive;
  }

  ovFullScreenDirectiveCtrl.$inject = ['$scope', '$window', '$timeout', '$compile'];
  ovFullScreenDirectiveLink.$inject = ['$window', '$timeout', '$compile'];

  ng.module('sampleApp')
    .directive('ovFullScreenDirective', ovFullScreenDirective);
})(angular);