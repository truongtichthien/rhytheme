(function (ng) {
  'use strict';

  function ovFullScreenDirectiveLink($window, $timeout, $compile, scope, element) {
    var anchorElement,
      backdropElement,
      imitatedElement,
      windowElement,
      bodyElement;

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

    /** *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
     * the MOST IMPORTANT thing is finding the HTML element containing 'anchor' class
     * *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=* */
    anchorElement = _findAnchorElement();

    if (anchorElement) {
      windowElement = ng.element($window);
      bodyElement = ng.element('body');

      _calculateViewPortDimension();
      _calculateElementDimension(anchorElement);

      windowElement.resize(_.debounce(
        function () {
          if (!scope.vm.fullScreenIsOpen) {
            _calculateViewPortDimension();
            _calculateElementDimension(anchorElement);
          } else {
            _calculateViewPortDimension();
            _calculateElementDimension(imitatedElement);

            /** update backdrop position for scaling out */
            backdropElement
              .css({
                top: (anchorEleDimension.top - 50) + 'px',
                left: (anchorEleDimension.left - 10) + 'px',
                width: (anchorEleDimension.width + 20) + 'px',
                height: (anchorEleDimension.height + 60) + 'px'
              })
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

    function _generateImitatedElement() {
      anchorElement.after('<div class="ov-full-screen-imitated-element"></div>');

      imitatedElement = ng.element('.ov-full-screen-imitated-element');
      imitatedElement
        .css({
          width: '100%',
          height: anchorEleDimension.height,
          'margin-top': anchorEleMargin.top,
          'margin-right': anchorEleMargin.right,
          'margin-bottom': anchorEleMargin.bottom,
          'margin-left': anchorEleMargin.left
        });
    }

    function _calculateViewPortDimension() {
      windowEleDimension.width = windowElement[0].innerWidth;
      windowEleDimension.height = windowElement[0].innerHeight;
    }

    function _calculateElementDimension(element) {
      anchorEleDimension.top = element[0].offsetTop;
      anchorEleDimension.left = element[0].offsetLeft;
      anchorEleDimension.width = element[0].offsetWidth;
      anchorEleDimension.height = element[0].offsetHeight;

      anchorEleMargin.top = parseInt(element.css('margin-top').replace('px', ''));
      anchorEleMargin.right = parseInt(element.css('margin-right').replace('px', ''));
      anchorEleMargin.bottom = parseInt(element.css('margin-bottom').replace('px', ''));
      anchorEleMargin.left = parseInt(element.css('margin-left').replace('px', ''));
    }

    function _enterFullScreen() {
      _generateImitatedElement();

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
          '<div class="ov-full-screen-backdrop" style="' +
          'top: ' + (anchorEleDimension.top - 50) + 'px;' +
          'left: ' + (anchorEleDimension.left - 10) + 'px;' +
          'width: ' + (anchorEleDimension.width + 20) + 'px;' +
          'height: ' + (anchorEleDimension.height + 60) + 'px">' +
          '<div class="pull-right ov-full-screen-remove-icon">' +
          '<i class="glyphicon glyphicon-remove" ng-click="exitFullScreen()"></i></div></div>')(childScope));

      /** add in-line styles */
      anchorElement
        .css({
          position: 'fixed',
          'z-index': 101,
          top: anchorEleDimension.top - anchorEleMargin.top,
          right: windowEleDimension.width - (anchorEleDimension.left + anchorEleDimension.width + anchorEleMargin.right),
          bottom: windowEleDimension.height - (anchorEleDimension.top + anchorEleDimension.height + anchorEleMargin.bottom),
          left: anchorEleDimension.left - anchorEleMargin.left
        });

      $timeout(function () {
        backdropElement = ng.element('.ov-full-screen-backdrop');

        backdropElement
          .addClass('full-screen');

        anchorElement
          .addClass('floating');
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
          })
          .removeClass('floating');

        $timeout(function () {
          imitatedElement
            .remove();

          /** remove backdrop element from DOM */
          backdropElement
            .remove();

          /** destroy generated child scope */
          childScope.$destroy();
          childScope = undefined;

          /** clear in-line styles added when triggering enterFullScreen() */
          anchorElement
            .css({
              position: '',
              'z-index': '',
              top: '',
              right: '',
              bottom: '',
              left: ''
            })

          windowElement.resize();
        }, 300);
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
      link: _link,
      templateUrl: 'scripts/directives/ovFullScreen.directive.html'
    };

    function _link($scope, element) {
      ovFullScreenDirectiveLink($window, $timeout, $compile, $scope, element);
    }

    return directive;
  }

  ovFullScreenDirective.$inject = ['$window', '$timeout', '$compile'];

  ng.module('sampleApp')
    .directive('ovFullScreen', ovFullScreenDirective);
})(angular);