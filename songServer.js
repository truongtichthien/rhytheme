(function (req) {

  /** DATABASE ====================== */

  var songDb, listDb, songListRelative;
  songDb = [{
    id: 1,
    title: 'Radioactive 1',
    artist: 'Imagine Dragon'
  }];

  listDb = [{
    id: 1,
    name: 'PlayList 2011',
    description: 'Imagine Dragon'
  }];

  songListRelative = [{
    idList: 1,
    idSong: 1
  }];

  /** SET UP ======================== */

  var _ = req('lodash');
  var express = req('express');
  var bodyParser = req('body-parser');
  var app = express();
  var PORT = 3000,
    songApi = '/api/song',
    listApi = '/api/playlist';

  var statusCode = {
    ok: 'SUCCESS',
    badRequest: 'ERROR - 400 Bad Request'
  };

  //noinspection JSUnresolvedVariable
  /** CONFIGURATION ================= */

  app.use(express.static(__dirname + '/app'));
  app.use(bodyParser.json());

  /** API =========================== */

  app.get('', function (request, response) {
    response.sendFile('indexSongTest.html');
  });

  /** GET SONG API DEFINITION */
  app.get(songApi, function (request, response) {
    _newSession();

    response.send(songDb);
    _printLog('Song retrieved: ' + statusCode.ok);
  });

  /** ADD SONG API DEFINITION */
  app.post(songApi, function (request, response) {
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

      _printLog('Song created: SUCCESS');
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Song created: ' + statusCode.badRequest);
    }
  });

  /** UPDATE SONG API DEFINITION */
  app.put(songApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var newSong = request.body;

    if (!_.isUndefined(newSong.id) && !_.isUndefined(newSong.title) && !_.isUndefined(newSong.artist)) {
      var existingSong = _.find(songDb, function (song) {
        return song.id === newSong.id;
      });

      if (_.isObject(existingSong)) {
        _.remove(songDb, function (song) {
          return song.id === newSong.id;
        });

        songDb.push(newSong);

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
  app.delete(songApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var idArray = request.body,
      responseArray = [];

    if (_.isArray(idArray)) {
      _.forEach(idArray, function (id) {
        var existingSong = _.find(songDb, function (song) {
          return song.id === id;
        });

        if (_.isObject(existingSong)) {
          _.remove(songDb, function (song) {
            return song.id === id;
          });

          responseArray.push(_createResponse(true, 'Song with ID ' + id + ' deleted successfully'));

          _printLog('Song ' + id + ' deleted: SUCCESS');
        } else {
          responseArray.push(_createResponse(false, 'Song with ID ' + id + ' could not found'));

          _printLog('Song ' + id + ' deleted: ERROR - Song could not found');
        }
      });

      response
        .status(200)
        .send(responseArray);

      _printLog('Song deleted: ' + statusCode.ok);
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Song deleted: ' + statusCode.badRequest);
    }
  });

  app.get(listApi, function (request, response) {
    _newSession();

    response.send(listDb);
    _printLog('Send playlistDb successfully');
  });

  app.post(listApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var newList = request.body;

    if (typeof(newList.name) !== 'undefined' && typeof(newList.description) !== 'undefined') {
      newList.id = listDb.length + 1;
      listDb.push(newList);

      /** send response */
      response
        .status(200)
        .send(_createResponse(true, 'Playlist created successfully'));
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Playlist created: ' + statusCode.badRequest);
    }
  });

  app.put(listApi, function (request, response) {
  });

  app.delete(listApi, function (request, response) {
  });

  /** SERVER EXECUTION ============== */

  app.listen(PORT);

  _clearScreen();
  _printConsole('*=================================*');
  _printConsole('*  Server listening on port ' + PORT + '  *');
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