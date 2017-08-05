(function () {
  'use strict';

  var fileInput = document.getElementById('fileInput'),
    fileDisplayArea = document.getElementById('fileDisplayArea'),
    //fileNameDisplayArea = document.getElementById('fileNameDisplayArea'),
    reloadBtn = document.getElementById('reloadBtn'),
    maxOccurrence = document.getElementById('maxOccurrence'),
    storage = {},
    report = {};

  fileInput.addEventListener('change', _eventCallback);
  reloadBtn.addEventListener('click', _eventCallback);
  // reloadBtn.addEventListener('click', _getFileFromLocal);

  function _createJsonPath(value, rootPath) {
    var k, path;
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        var i, len;
        for (i = 0, len = value.length; i < len; i++) {
          _createJsonPath(value[i], rootPath + '[' + i + ']');
        }
      } else {
        for (k in value) {
          // console.log(k);
          if (value.hasOwnProperty(k)) {
            path = rootPath ? rootPath + '.' : '';
            path = path + k;
            _createJsonPath(value[k], path);
          }
        }
      }
    } else {
      // what you want to do with each path line
      // store both path line and value to count the occurrence of each properties
      storage[rootPath] = value;
      // console.log(rootPath);
    }
  }

  function _convertRegExp(input) {
    var str = input.replace(/\n/g, ''), //remove all line break (\n) characters
      pattern = /[-!$%^&*()#_+|~=`\[\]:"”{}@;'<>?,.\\/]/g,
      result, indexes = [];

    while ((result = pattern.exec(str)) !== null) {
      indexes.push(result.index);
    }

    if (indexes.length > 0) {
      for (var i = 0, len = indexes.length; i < len; i++) {
        str = [str.slice(0, indexes[i] + i), '\\', str.slice(indexes[i] + i)].join('');
      }
    }

    return str;
  }

  // function _replaceEmptyString(value) {
  //   var converted = value;
  //
  //   if (angular.isString(converted)) {
  //     /** replace the empty key ("") with the specific string */
  //     if (converted === '') {
  //       converted = '[empty_string]';
  //     }
  //   }
  //
  //   return converted;
  // }
  // function _escapeRegExp(string) {
  //   var regex = string;
  //
  //   /** escape special characters by putting an backslash before each of them */
  //   regex = regex.replace(/[-!$%^&*()#_+|~=`\[\]:"”{}@;'<>?,.\\\/]/g, '\\$&');
  //
  //   return regex;
  // }
  // function _convertObjToString(obj) {
  //   var string;
  //
  //   /** convert object to string */
  //   string = JSON.stringify(obj);
  //
  //   /** replace backslash character (\) */
  //   string = string.replace(/(\\)(?!\\)/g, '').replace(/\\\\/g, '\\');
  //
  //   return string;
  // }
  // function _countValueOccurrence(obj) {
  //   var k, objToString, arrayResult;
  //
  //   /** empty report object */
  //   report = {};
  //
  //   objToString = _convertObjToString(obj);
  //
  //   for (k in obj) {
  //     if (obj.hasOwnProperty(k)) {
  //       var re;
  //
  //       /** generate regEx to compare with objToString */
  //       if (angular.isNumber(obj[k])) {
  //         re = new RegExp('\"\:' + obj[k], 'g');
  //       } else {
  //         re = new RegExp('\"\:\"' + _escapeRegExp(obj[k]) + '\"', 'g');
  //       }
  //
  //       /** compare objToString */
  //       arrayResult = objToString.match(re);
  //
  //       /**  */
  //       if (!arrayResult) {
  //         console.info('occurrence null: ', arrayResult, re, obj[k]);
  //       } else {
  //
  //         // if (arrayResult && arrayResult.length >= vm.minOccurrence && arrayResult.length <= vm.maxOccurrence) {
  //         report[obj[k]] = report[obj[k]] || [];
  //         report[obj[k]].push(k);
  //         // }
  //       }
  //     }
  //   }
  //
  //   _filterProperty(report);
  // }

  function _countValueOccurrence(obj) {
    var k, arrayResult;
    for (k in obj) {
      if (obj.hasOwnProperty(k)) {
        var re, stringStorage;
        if (typeof obj[k] === 'number') {
          re = new RegExp('\":' + obj[k], 'g');
        } else {
          re = new RegExp('\":\"' + _convertRegExp(obj[k]) + '\"', 'g');
        }

        stringStorage = JSON.stringify(obj).replace(/\\n|(\\)(?!\\)/g, '').replace(/\\\\/g, '\\'); // remove all "\n" or "\" strings
        arrayResult = stringStorage.match(re);

        if (!arrayResult) {
          console.log(arrayResult, re, obj[k]);
        }

        if (arrayResult && arrayResult.length >= (maxOccurrence.value || 2)) {
          report[obj[k]] = report[obj[k]] || [];
          report[obj[k]].push(k);
        }
      }
    }
    console.log(JSON.stringify(report));
  }

  // function _getFileFromLocal() {
  //   var rawFile = new XMLHttpRequest();
  //   var file = "file:///d:/JSON Reader/sample.json";
  //
  //   rawFile.open("GET", file, false);
  //   rawFile.onreadystatechange = function () {
  //     if (rawFile.readyState === 4) {
  //       if (rawFile.status === 200 || rawFile.status == 0) {
  //         var allText = rawFile.responseText;
  //         console.log(allText);
  //       }
  //     }
  //   };
  //
  //   rawFile.send(null);
  // }

  function _eventCallback(e) {
    var file, fileName, isJsonFile;

    file = fileInput.files[0];
    //fileType = file.type; //file.type.match(fileType)
    fileName = file.name;
    isJsonFile = fileName.toLowerCase().indexOf('.json') > 0;

    // print file name
    // fileNameDisplayArea.innerHTML = fileName;

    // only process json file
    if (isJsonFile) {
      var reader, text, jsonObj;
      reader = new FileReader();
      storage = {};
      report = {};

      reader.onload = function () {
        text = reader.result;
        // fileDisplayArea.innerText = text;
        fileDisplayArea.innerText = '';
        jsonObj = JSON.parse(text);
        // console.log(jsonObj);
        _createJsonPath(jsonObj);
        //console.log(JSON.stringify(storage));
        _countValueOccurrence(storage);
      };

      reader.readAsText(file);
    } else {
      fileDisplayArea.innerText = "File not supported!"
    }
  }
})();
