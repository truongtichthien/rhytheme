/**
 (c) Copyright ALE USA Inc., 2016
 All Rights Reserved. No part of this file may be reproduced, stored in a retrieval system,
 or transmitted in any form or by any means, electronic, mechanical,
 photocopying, or otherwise without the prior permission of ALE USA Inc..
 */

(function (ng) {
  'use strict';

  function ovDottieSrv() {

    var srv = {};
    srv = Dottie;

    srv.getArray = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return angular.isArray(val) ? val : defaultVal || [];
    };

    srv.getObject = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return angular.isObject(val) ? val : defaultVal || {};
    };

    srv.getString = function (values, exp, defaultVal) {
      var val = srv.get(values, exp), _defaultVal = angular.isFunction(defaultVal) ? defaultVal() : defaultVal;
      return angular.isString(val) ? val : _defaultVal || '';
    };

    srv.getNumber = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return isNaN(Number(val)) ? Number(defaultVal || 0) : Number(val);
    };

    srv.getFunction = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return angular.isFunction(val) ? val : defaultVal || angular.noop;
    };

    srv.getBoolean = function (values, exp, defaultVal) {
      var val = srv.get(values, exp);
      return typeof val === 'boolean' ? val : defaultVal || false;
    };

    return srv;
  }

  ng.module('dottie', [])
    .service('dottie', ovDottieSrv);

})(angular);