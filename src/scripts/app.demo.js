/**
 * Created by ThienTruong
 */

(function (ng, doc) {
  'use strict';

  /** manually bootstrap app */
  function manuallyBootstrap(document) {
    ng.bootstrap(document, ['demoModule']);
  }

  ng.element((function (doc) {
    return manuallyBootstrap(doc);
  })(doc));

})(window.angular, window.document);