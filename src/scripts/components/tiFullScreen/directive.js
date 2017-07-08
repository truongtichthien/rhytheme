/**
 * Created by ThienTruong
 */

(function (ng, _) {
  'use strict';

  function tiFullScreenDirectiveLink($document, $window, $timeout, $compile, scope, element) {
    var anchorElement,
      backdropElement,
      imitatedElement,
      documentElement,
      windowElement,
      bodyElement,
      replacedItemElement,
      iFrameElement;

    var bodyTagName = 'BODY';

    var anchorClassName = 'ti-full-screen-anchor',
      replacedElementClassName = 'ti-full-screen-replaced-element',
      iFrameElementClassName = 'ti-full-screen-iframe';

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

    var fullScreenIsOpen = false;

    var translationDuration = 400,
      translationDelay = 100;

    element.ready(function () {
      /** call $digest afterward because angularJs doesn't detect changes caused by non-angular functions */
      scope.$apply(function () {
        /** *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
         * the MOST IMPORTANT thing is finding the HTML element containing 'anchor' class */
        anchorElement = _findAnchorElement();
        /** *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=* */

        if (anchorElement) {
          documentElement = ng.element($document);
          windowElement = ng.element($window);
          bodyElement = ng.element(bodyTagName);

          _calculateViewPortDimension();
          _calculateElementDimension(anchorElement);

          scope.vm = {
            enterFullScreen: _enterFullScreen,
            exitFullScreen: _exitFullScreen,
            iconClass: scope.tiFullScreen.iconClass || '',
            headerTitle: scope.tiFullScreen.headerTitle || '',
            showButton: !_.isUndefined(scope.tiFullScreen.showButton) ? scope.tiFullScreen.showButton : true
          };

          /** define which functions could be only referred from the outside controller */
          scope.tiFullScreen.api = {
            stateOfFullScreen: _stateOfFullScreen,
            enterFullScreen: _enterFullScreen,
            exitFullScreen: _exitFullScreen
          };
        }
      });
    });

    function _findParent(ele, className) {
      var parent = ele.parent();
      var classList = parent[0].classList.value;

      if (classList.indexOf(className) >= 0 || parent[0].tagName === bodyTagName) {
        return parent;
      } else {
        return _findParent(parent);
      }
    }

    function _findAnchorElement() {
      var classList = element[0].classList.value,
        targetEle;
      if (classList.indexOf(anchorClassName) >= 0) {
        targetEle = element;
      } else {
        targetEle = _findParent(element, anchorClassName);
      }

      if (targetEle[0].tagName === bodyTagName) {
        console.error('TiFullScreen Component: The HTML element with class .ti-full-screen-anchor could not found!');
        return false;
      } else {
        return targetEle;
      }
    }

    function _hasReplacingTpl() {
      return _.isString(scope.tiFullScreen.replacingTpl) && scope.tiFullScreen.replacingTpl !== '';
    }

    function _findReplacedItemElement(ele) {
      return ele.find('.' + replacedElementClassName);
    }

    function _findIFrameElement(ele) {
      return ele.find('.' + iFrameElementClassName);
    }

    function _generateImitatedElement() {
      var classList = anchorElement[0].classList.value.replace('ti-full-screen-anchor', '');
      anchorElement.after('<div class="ti-full-screen-imitated-element ' + classList + '"></div>');

      imitatedElement = ng.element('.ti-full-screen-imitated-element');
      imitatedElement
        .css({
          height: anchorEleDimension.height
        });
    }

    function _calculateViewPortDimension() {
      /** get width of window without scrollbar'width */
      bodyEleDimension.width = bodyElement[0].clientWidth;
      /** get height of window */
      bodyEleDimension.height = windowElement[0].innerHeight;
      /** get position of the vertical scrollbar */
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
          right: (position.right - 10) + 'px',
          bottom: (position.bottom - 10) + 'px',
          left: (position.left - 10) + 'px'
        });
    }

    function _stateOfFullScreen() {
      return fullScreenIsOpen;
    }

    function _enterFullScreen() {
      if (fullScreenIsOpen) {
        console.info('TiFullScreen Component: full-screen appeared already!');
      } else {
        _calculateViewPortDimension();
        _calculateElementDimension(anchorElement);

        _generateImitatedElement();

        /** define variable to determine the state of fullScreen */
        $timeout(function callback() {
          fullScreenIsOpen = true;

          if (_hasReplacingTpl()) {
            replacedItemElement = _findReplacedItemElement(anchorElement);
            replacedItemElement.addClass('fade-out');
          }
        }, translationDelay);

        /** generate a new child scope */
        childScope = scope.$new(true);
        /** then define only necessary functions */
        childScope.vm = {
          isOpen: true, // opening state of full-screen
          headerTitle: scope.vm.headerTitle, // title at the top screen
          exitFullScreen: _exitFullScreen, // exit function
          keyDownHandler: _keyDownHandler // keyDown event handler
        };

        /** calculate position of anchor element */
        var position = _calculateElementPosition(bodyEleDimension, anchorEleDimension);

        // bodyElement
        //   .css({ overflow: 'hidden' });

        bodyElement
          .append($compile('' +
            '<div class="ti-full-screen-backdrop" style="' +
            'top: ' + (position.top - 20) + 'px;' +
            'right: ' + (position.right - 10) + 'px;' +
            'bottom: ' + (position.bottom - 20) + 'px;' +
            'left: ' + (position.left - 10) + 'px;">' +
            '<h3 class="pull-left ti-full-screen-heading">{{ vm.headerTitle }}</h3>' +
            '<div class="pull-right ti-full-screen-remove-icon">' +
            '<i class="glyphicon glyphicon-remove" ng-click="vm.exitFullScreen()"></i></div></div>')(childScope));

        /** add in-line styles */
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
          backdropElement = ng.element('.ti-full-screen-backdrop');

          backdropElement
            .addClass('full-screen');

          anchorElement
            .addClass('floating')
            .addClass('free-width');

          /** bind $event resize to $window */
          windowElement.on('resize', _.debounce(
            _onScreenChangedCallback, 100));

          /** bind $event scroll to $window */
          windowElement.on('scroll', _.debounce(
            _onScreenChangedCallback, 100));
        });
      }
    }

    function _exitFullScreen() {
      if (!childScope) {
        console.info('TiFullScreen Component: full-screen disappeared already!');
      } else {
        $timeout(function callback() {
          fullScreenIsOpen = false;

          if (_hasReplacingTpl()) {
            replacedItemElement.removeClass('fade-out');
          }
        }, translationDuration + translationDelay);

        /** unbind $event from $document, $window */
        documentElement.off('keydown');

        backdropElement
          .removeClass('full-screen');

        /** calculate position of anchor element */
        var position = _calculateElementPosition(bodyEleDimension, anchorEleDimension);

        bodyElement
          .css({ overflow: '' });

        anchorElement
          .css({
            top: position.top,
            right: position.right,
            bottom: position.bottom,
            left: position.left
          });
        anchorElement
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
          anchorElement
            .removeClass('free-width');

          /** unbind $events */
          windowElement.off('resize');
          windowElement.off('scroll');
        }, translationDuration + translationDelay);
      }
    }

    function _keyDownHandler(e) {
      if (e.keyCode === 27) {// e.key === 'ESCAPE'
        _exitFullScreen();
      }
    }
  }

  function tiFullScreenDirective($document, $window, $timeout, $compile) {
    var directive;

    //todo define default config
    /**
     * default config
     * {
     *
     * }
     * */

    directive = {
      restrict: 'EA',
      scope: {
        tiFullScreen: '=?'
      },
      link: _link,
      templateUrl: 'scripts/components/tiFullScreen/directive.html'
    };

    function _link(scope, element) {
      scope.tiFullScreen = scope.tiFullScreen || {};

      tiFullScreenDirectiveLink($document, $window, $timeout, $compile, scope, element);
    }

    return directive;
  }

  tiFullScreenDirective.$inject = ['$document', '$window', '$timeout', '$compile'];

  ng.module('tiFullScreenModule', [])
    .directive('tiFullScreen', tiFullScreenDirective);

})(window.angular, window._);