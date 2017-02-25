(function (ng) {
  'use strict';

  function ovFullScreenDirectiveLink($window, $timeout, $compile, scope, element) {
    var anchorElement,
      backdropElement,
      windowElement = ng.element($window),
      bodyElement = ng.element('body');

    var childScope;

    var anchorEleDimension = {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      },
      anchorEleMargin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },
      windowEleDimension = {
        width: 0,
        height: 0
      };

    anchorElement = _findAnchorElement();

    if (anchorElement) {
      _calculateViewPortDimension();
      _calculateElementDimension();

      windowElement.resize(_.debounce(
        function () {
          if (!scope.vm.fullScreenIsOpen) {
            _calculateViewPortDimension();
            _calculateElementDimension();
          }
        }, 100));

      scope.vm = {
        enterFullScreen: _enterFullScreen,
        exitFullScreen: _exitFullScreen,
        fullScreenIsOpen: false
      };

      scope.api = {
        exitFullScreen: _exitFullScreen
      };
    }

    function _calculateViewPortDimension() {
      windowEleDimension.width = windowElement[0].innerWidth;
      windowEleDimension.height = windowElement[0].innerHeight;
    }

    function _calculateElementDimension() {
      anchorEleDimension.top = anchorElement[0].offsetTop;
      anchorEleDimension.left = anchorElement[0].offsetLeft;
      anchorEleDimension.width = anchorElement[0].offsetWidth;
      anchorEleDimension.height = anchorElement[0].offsetHeight;

      anchorEleMargin.top = parseInt(anchorElement.css('margin-top').replace('px', ''));
      anchorEleMargin.right = parseInt(anchorElement.css('margin-right').replace('px', ''));
      anchorEleMargin.bottom = parseInt(anchorElement.css('margin-bottom').replace('px', ''));
      anchorEleMargin.left = parseInt(anchorElement.css('margin-left').replace('px', ''));
    }

    function _enterFullScreen() {

      /** generate a new child scope */
      childScope = scope.$new(true);
      /** then define only necessary functions */
      childScope.exitFullScreen = _exitFullScreen;
      /** listen $destroy on child scope */
      childScope.$on('$destroy', function () {
        console.info('OvFullScreen Component: $childScope destroyed!');
      });

      scope.vm.fullScreenIsOpen = true;

      bodyElement
        .append($compile('' +
          '<div style="' +
          'top: ' + (anchorEleDimension.top - 50) + 'px;' +
          'left: ' + (anchorEleDimension.left - 10) + 'px;' +
          'width: ' + (anchorEleDimension.width + 20) + 'px;' +
          'height: ' + (anchorEleDimension.height + 60) + 'px " class="ov-full-screen-backdrop">' +
          '<div class="pull-right ov-full-screen-remove-icon">' +
          '<i class="glyphicon glyphicon-remove" ng-click="exitFullScreen()"></i></div></div>')(childScope));

      anchorElement
        .css({
          position: 'fixed',
          top: anchorEleDimension.top - anchorEleMargin.top,
          right: windowEleDimension.width - (anchorEleDimension.left + anchorEleDimension.width + anchorEleMargin.right),
          bottom: windowEleDimension.height - (anchorEleDimension.top + anchorEleDimension.height + anchorEleMargin.bottom),
          left: anchorEleDimension.left - anchorEleMargin.left
        });

      $timeout(function () {
        backdropElement = ng.element('.ov-full-screen-backdrop');

        anchorElement
          .addClass('floating');

        backdropElement
          .addClass('full-screen');
      });
    }

    function _exitFullScreen() {
      if (!childScope) {
        console.info('OvFullScreen Component: Exit full-screen already!');
      } else {
        scope.vm.fullScreenIsOpen = false;

        backdropElement
          .removeClass('full-screen');

        anchorElement
          .css({
            top: anchorEleDimension.top - anchorEleMargin.top,
            right: windowEleDimension.width - (anchorEleDimension.left + anchorEleDimension.width + anchorEleMargin.right),
            bottom: windowEleDimension.height - (anchorEleDimension.top + anchorEleDimension.height + anchorEleMargin.bottom),
            left: anchorEleDimension.left - anchorEleMargin.left
          });

        $timeout(function () {
          backdropElement
            .remove();

          /** destroy generated child scope */
          childScope.$destroy();
          childScope = undefined;

          anchorElement
            .css({
              position: '',
              top: '',
              right: '',
              bottom: '',
              left: ''
            })
        }, 300);

        $timeout(function () {
          anchorElement
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

    function _findAnchorElement() {
      var classList = element[0].classList.value,
        targetEle;
      if (classList.indexOf('ov-full-screen-anchor') >= 0) {
        targetEle = element;
      } else {
        targetEle = _findParent(element);
      }

      if (targetEle[0].tagName === 'BODY') {
        console.error('OvFullScreen Component: The HTML element with class .ov-full-screen-anchor could not found!');
        return false;
      } else {
        return targetEle;
      }
    }
  }

  function ovFullScreenDirective($window, $timeout, $compile) {
    var directive;

    directive = {
      restrict: 'EA',
      scope: {
        api: '=?'
      },
      link: function ($scope, element) {
        ovFullScreenDirectiveLink($window, $timeout, $compile, $scope, element);
      },
      templateUrl: 'scripts/directives/ovFullScreen.directive.html'
    };

    return directive;
  }

  ovFullScreenDirective.$inject = ['$window', '$timeout', '$compile'];

  ng.module('sampleApp')
    .directive('ovFullScreenDirective', ovFullScreenDirective);
})(angular);