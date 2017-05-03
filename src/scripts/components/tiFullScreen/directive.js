/**
 * Created by ThienTruong
 */

(function (ng) {
  'use strict';

  function ovFullScreenDirectiveLink($document, $window, $timeout, $compile, scope, element) {
    var anchorElement,
      backdropElement,
      imitatedElement,
      documentElement,
      windowElement,
      bodyElement;

    var childScope;

    var anchorEleDimension = {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    };

    /** DEPRECATED
     * var anchorEleMargin = { top: 0, right: 0, bottom: 0, left: 0 }, */

    var bodyEleDimension = {
      width: 0,
      height: 0,
      scrollTop: 0
    };

    documentElement = ng.element($document);

    documentElement.ready(function () {
      /** *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
       * the MOST IMPORTANT thing is finding the HTML element containing 'anchor' class */
      anchorElement = _findAnchorElement();
      /** *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=* */

      if (anchorElement) {
        windowElement = ng.element($window);
        bodyElement = ng.element('body');

        _calculateViewPortDimension();
        _calculateElementDimension(anchorElement);

        scope.vm = {
          enterFullScreen: _enterFullScreen,
          exitFullScreen: _exitFullScreen,
          fullScreenIsOpen: false,
          iconClass: scope.ovFullScreen.iconClass || '',
          headerTitle: scope.ovFullScreen.headerTitle || ''
        };

        /** define which functions could be only referred from the outside controller */
        scope.ovFullScreen.api = {
          exitFullScreen: _exitFullScreen
        };
      }
    });

    function _findParent(ele) {
      var parent = ele.parent();
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
      var classList = anchorElement[0].classList.value.replace('ov-full-screen-anchor', '');
      anchorElement.after('<div class="ov-full-screen-imitated-element ' + classList + '"></div>');

      imitatedElement = ng.element('.ov-full-screen-imitated-element');
      imitatedElement
        .css({
          height: anchorEleDimension.height
        });
    }

    function _calculateViewPortDimension() {
      bodyEleDimension.width = windowElement.innerWidth();
      bodyEleDimension.height = windowElement.innerHeight();
      bodyEleDimension.scrollTop = bodyElement.scrollTop();
    }

    function _calculateElementDimension(ele) {
      /** notice: ele[0].offsetTop / offsetLeft ``` DEPRECATED
       * use ele.offset().top / left -> jQlite function */
      anchorEleDimension.top = ele.offset().top;
      anchorEleDimension.left = ele.offset().left;
      anchorEleDimension.width = ele[0].offsetWidth;
      anchorEleDimension.height = ele[0].offsetHeight;

      /** DEPRECATED
       * anchorEleMargin.top = parseFloat(ele.css('margin-top').replace('px', ''));
       * anchorEleMargin.right = parseFloat(ele.css('margin-right').replace('px', ''));
       * anchorEleMargin.bottom = parseFloat(ele.css('margin-bottom').replace('px', ''));
       * anchorEleMargin.left = parseFloat(ele.css('margin-left').replace('px', ''));
       * */
    }

    function _calculateElementPosition(bodyEle, anchorEle) {
      var top = anchorEle.top - bodyEle.scrollTop,
        left = anchorEle.left,
        bottom = bodyEle.height - top - anchorEle.height,
        right = bodyEle.width - left - anchorEle.width;

      return {
        top: top,
        right: right,
        bottom: bottom,
        left: left
      }
    }

    function _onScreenChangedCallback() {
      _calculateViewPortDimension();
      _calculateElementDimension(imitatedElement);

      /** calculate position of anchor element */
      var position = _calculateElementPosition(bodyEleDimension, anchorEleDimension);

      /** update backdrop position for scaling out */
      backdropElement
        .css({
          top: (position.top - 20) + 'px',
          right: (position.width + 20) + 'px',
          bottom: (position.height + 30) + 'px',
          left: (position.left - 10) + 'px'
        });
    }

    function _enterFullScreen() {
      _calculateViewPortDimension();
      _calculateElementDimension(anchorElement);

      _generateImitatedElement();

      /**  */
      scope.vm.fullScreenIsOpen = true;

      /** generate a new child scope */
      childScope = scope.$new(true);
      /** then define only necessary functions */
      childScope.vm = {
        fullScreenIsOpen: scope.vm.fullScreenIsOpen,
        headerTitle: scope.vm.headerTitle,
        exitFullScreen: scope.vm.exitFullScreen,
        keyDownHandler: _keyDownHandler
      };

      /** calculate position of anchor element */
      var position = _calculateElementPosition(bodyEleDimension, anchorEleDimension);

      bodyElement
        .append($compile('' +
          '<div class="ov-full-screen-backdrop" style="' +
          'top: ' + (position.top - 20) + 'px;' +
          'right: ' + (position.right - 10) + 'px;' +
          'bottom: ' + (position.bottom - 20) + 'px;' +
          'left: ' + (position.left - 10) + 'px;">' +
          '<h3 class="pull-left ov-full-screen-heading">{{ vm.headerTitle }}</h3>' +
          '<div class="pull-right ov-full-screen-remove-icon">' +
          '<i class="glyphicon glyphicon-remove" ng-click="vm.exitFullScreen()"></i></div></div>')(childScope));

      /** add in-line styles */
      anchorElement.addClass('no-margin');
      anchorElement
        .css({
          position: 'fixed',
          'z-index': 101,
          top: position.top,
          right: position.right,
          bottom: position.bottom,
          left: position.left
        });

      /** bind $event keyDown to $document */
      documentElement.on('keydown', _keyDownHandler);

      $timeout(function () {
        backdropElement = ng.element('.ov-full-screen-backdrop');

        backdropElement
          .addClass('full-screen');

        anchorElement
          .addClass('floating');

        /** bind $event resize to $window */
        windowElement.on('resize', _.debounce(
          _onScreenChangedCallback, 100));

        /** bind $event scroll to $window */
        windowElement.on('scroll', _.debounce(
          _onScreenChangedCallback, 100));
      });
    }

    function _exitFullScreen() {
      if (!childScope) {
        console.info('OvFullScreen Component: Exit full-screen already!');
      } else {
        scope.vm.fullScreenIsOpen = false;

        /** unbind $event from $document, $window */
        documentElement.off('keydown');

        backdropElement
          .removeClass('full-screen');

        /** calculate position of anchor element */
        var position = _calculateElementPosition(bodyEleDimension, anchorEleDimension);

        anchorElement.removeClass('no-margin');
        anchorElement
          .css({
            top: position.top,
            right: position.right,
            bottom: position.bottom,
            left: position.left
          })
          .removeClass('floating');

        /** listen $destroy on child scope */
        childScope.$on('$destroy', function () {
          /** remove backdrop element from DOM */
          backdropElement
            .remove();
        });

        $timeout(function () {
          imitatedElement
            .remove();

          /** destroy generated child scope */
          childScope.$destroy();
          childScope = null;

          /** clear in-line styles added when triggering enterFullScreen() */
          anchorElement
            .css({
              position: '',
              'z-index': '',
              top: '',
              right: '',
              bottom: '',
              left: ''
            });

          /** unbind $events */
          windowElement.off('resize');
          windowElement.off('scroll');
        }, 300);
      }
    }

    function _keyDownHandler(e) {
      if (e.keyCode === 27) {// e.key === 'ESCAPE'
        _exitFullScreen();
      }
    }
  }

  function ovFullScreenDirective($document, $window, $timeout, $compile) {
    var directive;

    directive = {
      restrict: 'EA',
      scope: {
        ovFullScreen: '=?'
      },
      link: _link,
      templateUrl: 'scripts/components/tiFullScreen/directive.html'
    };

    function _link(scope, element) {
      scope.ovFullScreen = scope.ovFullScreen || {};

      ovFullScreenDirectiveLink($document, $window, $timeout, $compile, scope, element);
    }

    return directive;
  }

  ovFullScreenDirective.$inject = ['$document', '$window', '$timeout', '$compile'];

  ng.module('tiFullScreenModule', [])
    .directive('tiFullScreen', ovFullScreenDirective);

})(window.angular);