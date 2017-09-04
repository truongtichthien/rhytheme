(function (_req) {

  /** DATABASE ====================== */

  var songDb, listDb, songListRelative;
  // songDb = [{
  //   id: 1,
  //   title: 'Radioactive 1',
  //   artist: 'Imagine Dragon'
  // }];

  listDb = [{
    id: 1,
    name: 'PlayList 2011',
    description: 'Imagine Dragon',
    songs: []
  }];

  songListRelative = [{
    idList: 1,
    idSong: 1
  }];

  /** CONFIGURATION ================= */

  /** define package */
  var _ = _req('lodash');
  var _express = _req('express');
  var _bodyParser = _req('body-parser');
  var _morgan = _req('morgan');
  var _colors = _req('colors/safe');
  var _q = _req('q');
  var _fs = _req('fs');

  _fs.readFile('storage/songdb.json', 'utf8', function (err, data) {
    if (err) {
      return console.log('error ', err);
    }
    // console.log(data);
    songDb = JSON.parse(data);
  });

  /** config web server */
  var server = _express();
  var PORT = 3030;
  var songApi = '/api/song',
    listApi = '/api/playlist',
    songPlaylistApi = '/api/songplaylist';

  var statusCode = {
    ok: 'SUCCESS',
    badRequest: 'ERROR - 400 Bad Request'
  };

  //noinspection JSUnresolvedVariable
  server.use(_express.static(__dirname + '/app'));
  server.use(_bodyParser.json());

  var morganConfig = _morgan(function (tokens, request, response) {
    var timeStamp = _colors.grey('[' + _generateTimestamp() + ']'),
      method = _colors.green(tokens.method(request, response)),
      url = tokens.url(request, response),

      status = (function () {
        var status = tokens.status(request, response);
        switch (status[0]) {
          case '2':
            return _colors.blue(status);
          case '3':
            return _colors.cyan(status);
          case '4':
            return _colors.yellow(status);
          case '5':
            return status;
          default:
            return status;
        }
      })();

    // _newSession();

    return [timeStamp, '-', method, url, status,
      tokens.res(request, response, 'content-length'), '-',
      tokens['response-time'](request, response), 'ms'
    ].join(' ');
  });

  server.use(morganConfig);
  // server.use(morgan('dev'));

  /** API =========================== */

  server.get('', function (request, response) {
    response.sendFile('indexSongTest.html');
  });

  /** GET SONG API DEFINITION */
  server.get(songApi, function (request, response) {
    // _newSession();
    var deferred;
    var promises = [];

    function writeRes(deferred, i, timeout) {
      setTimeout(function () {
        console.log('write');
        response.write(JSON.stringify(_createResponse(true, 'Song with ID ' + i + ' deleted successfully')) + '\n');
        deferred.resolve();
      }, timeout * i);
    }

    for (var i = 0, len = 10; i < len; i++) {
      deferred = _q.defer();
      /** important thing
       * https://stackoverflow.com/questions/19696240/proper-way-to-return-json-using-node-or-express */
      response.setHeader('Content-Type', 'application/json');
      promises.push((function (d, i, t) {
        writeRes(d, i, t);
        return d.promise;
      })(deferred, i, 1000));
    }

    _q.all(promises)
      .then(function () {
        console.log('end');
        response.end();
      });

    // response.send(songDb);
    // _printLog('Song retrieved: ' + statusCode.ok);
  });

  /** ADD SONG API DEFINITION */
  server.post(songApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var newSong = request.body;

    if (!_.isUndefined(newSong.title) && !_.isUndefined(newSong.artist)) {
      newSong.id = songDb.length + 1;
      songDb.push(newSong);

      /** send response */
      response
        .status(200)
        .send(_createResponse(true, 'Song added successfully'));

      _printLog('Song added: SUCCESS');
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Song added: ' + statusCode.badRequest);
    }
  });

  /** UPDATE SONG API DEFINITION */
  server.put(songApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var specificSong = request.body;

    if (!_.isUndefined(specificSong.id) && !_.isUndefined(specificSong.title) && !_.isUndefined(specificSong.artist)) {
      var existingSong = _.find(songDb, function (song) {
        return song.id === specificSong.id;
      });

      if (_.isObject(existingSong)) {
        _.remove(songDb, function (song) {
          return song.id === specificSong.id;
        });

        songDb.push(specificSong);

        /** send response */
        response
          .status(200)
          .send(_createResponse(true, 'Song updated successfully'));

        _printLog('Song updated: ' + statusCode.ok);
      } else {
        response
          .status(200)
          .send(_createResponse(false, 'Song could not found'));

        _printLog('Song updated: ERROR - Song could not found');
      }
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Song updated: ' + statusCode.badRequest);
    }
  });

  /** DELETE SONG API DEFINITION */
  server.delete(songApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var idArray = request.body.id,
      responseArray = [],
      responsePart = '';

    if (_.isArray(idArray)) {
      response
        .status(200);

      _.forEach(idArray, function (id) {
        var existingSong = _.find(songDb, function (song) {
          return song.id === id;
        });

        if (_.isObject(existingSong)) {
          _.remove(songDb, function (song) {
            return song.id === id;
          });

          // responseArray.push(_createResponse(true, 'Song with ID ' + id + ' deleted successfully'));
          responsePart = 'Song with ID ' + id + ' deleted successfully';

          _printLog('Song ' + id + ' deleted: SUCCESS');
        } else {
          // responseArray.push(_createResponse(false, 'Song with ID ' + id + ' could not found'));
          responsePart = 'Song with ID ' + id + ' could not found';

          _printLog('Song ' + id + ' deleted: ERROR - Song could not found');
        }

        response
          .write(responsePart);
      });

      response
        .end();

      _printLog('Song deleted: ' + statusCode.ok);
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Song deleted: ' + statusCode.badRequest);
    }
  });

  /** GET PLAYLIST API DEFINITION */
  server.get(listApi, function (request, response) {
    _newSession();

    response.send(listDb);
    _printLog('Playlist retrieved: ' + statusCode.ok);
  });

  /** ADD PLAYLIST API DEFINITION */
  server.post(listApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var newList = request.body;

    if (!_.isUndefined(newList.name) && !_.isUndefined(newList.description)) {
      newList.id = listDb.length + 1;
      listDb.push(newList);

      /** send response */
      response
        .status(200)
        .send(_createResponse(true, 'Playlist added successfully'));

      _printLog('Playlist added: SUCCESS');
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Playlist added: ' + statusCode.badRequest);
    }
  });

  /** UPDATE PLAYLIST API DEFINITION */
  server.put(listApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var specificList = request.body;

    if (!_.isUndefined(specificList.id) && !_.isUndefined(specificList.name) && !_.isUndefined(specificList.description) && !_.isUndefined(specificList.songs)) {
      var existingList = _.find(listDb, function (list) {
        return list.id === specificList.id;
      });

      if (_.isObject(existingList)) {
        _.remove(listDb, function (list) {
          return list.id === specificList.id;
        });

        _.remove(songListRelative, function (rel) {
          return rel.idList === existingList.id;
        });

        listDb.push(specificList);

        _.forEach(specificList.songs, function (songId) {
          songListRelative.push({
            idList: specificList.id,
            idSong: songId
          });
        });

        /** send response */
        response
          .status(200)
          .send(_createResponse(true, 'Playlist updated successfully'));

        _printLog('Playlist updated: ' + statusCode.ok);
      } else {
        response
          .status(200)
          .send(_createResponse(false, 'Playlist could not found'));

        _printLog('Playlist updated: ERROR - Playlist could not found');
      }
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Playlist updated: ' + statusCode.badRequest);
    }
  });

  /** DELETE PLAYLIST API DEFINITION */
  server.delete(listApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var idArray = request.body.id,
      responseArray = [];

    if (_.isArray(idArray)) {
      _.forEach(idArray, function (id) {
        var existingList = _.find(listDb, function (list) {
          return list.id === id;
        });

        if (_.isObject(existingList)) {
          _.remove(listDb, function (list) {
            return list.id === id;
          });

          _.remove(songListRelative, function (rel) {
            return rel.idList === existingList.id;
          });

          responseArray.push(_createResponse(true, 'Playlist with ID ' + id + ' deleted successfully'));

          _printLog('Playlist ' + id + ' deleted: SUCCESS');
        } else {
          responseArray.push(_createResponse(false, 'Playlist with ID ' + id + ' could not found'));

          _printLog('Playlist ' + id + ' deleted: ERROR - Playlist could not found');
        }
      });

      response
        .status(200)
        .send(responseArray);

      _printLog('Playlist deleted: ' + statusCode.ok);
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Playlist deleted: ' + statusCode.badRequest);
    }
  });

  /** GET THE RELATIONSHIP OF SONG AND PLAYLIST API DEFINITION */
  server.get(songPlaylistApi, function (request, response) {
    _newSession();

    response.send(songListRelative);
    _printLog('Song <> Playlist retrieved: ' + statusCode.ok);
  });

  /** SERVER EXECUTION ============== */

  server.listen(PORT);

  _clearScreen();
  _printConsole('*=================================*');
  _printConsole('*= Server listening on port ' + PORT + ' =*');
  _printConsole('*=================================*');

  /** FUNCTION DEFINITION =========== */

  function _generateTimestamp() {
    var date = new Date();
    return date.toDateString() + ' ' + date.toLocaleTimeString();
  }

  function _printConsole(msg) {
    console.log('[' + _generateTimestamp() + ']: ' + msg);
  }

  function _printLog(msg) {
    _printConsole('LOG: ' + msg);
  }

  function _newSession() {
    _printConsole('=== New Session ===================');
  }

  function _clearScreen() {
    console.log('\033c');
  }

  function _createResponse(success, msg) {
    return {
      success: success,
      message: msg
    };
  }
})(require);