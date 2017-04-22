/**
 * Created by ThienTruong
 */

(function (ng, doc) {
  'use strict';

  /** manually bootstrap app */
  ng.element(function () {
    ng.bootstrap(doc, ['rhythemeModule']);
  });

})(window.angular, window.document);