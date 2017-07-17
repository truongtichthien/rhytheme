/**
 * Created by ThienTruong
 */

(function (ng, doc) {
  'use strict';

  /** manually bootstrap app */
  function manuallyBootstrap(document) {
    ng.bootstrap(document, ['rhythemeModule']);
  }

  ng.element((function (doc) {
    return manuallyBootstrap(doc);
  })(doc));

})(window.angular, window.document);