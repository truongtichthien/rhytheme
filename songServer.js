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
    description: 'Imagine Dragon',
    songs: []
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
    listApi = '/api/playlist',
    songPlaylistApi = '/api/songplaylist';

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

      _printLog('Song added: SUCCESS');
    } else {
      response
        .status(400)
        .send(_createResponse(false, 'Bad Request'));

      _printLog('Song added: ' + statusCode.badRequest);
    }
  });

  /** UPDATE SONG API DEFINITION */
  app.put(songApi, function (request, response) {
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

  /** GET PLAYLIST API DEFINITION */
  app.get(listApi, function (request, response) {
    _newSession();

    response.send(listDb);
    _printLog('Playlist retrieved: ' + statusCode.ok);
  });

  /** ADD PLAYLIST API DEFINITION */
  app.post(listApi, function (request, response) {
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
  app.put(listApi, function (request, response) {
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
  app.delete(listApi, function (request, response) {
    _newSession();
    _printLog('Request received');

    var idArray = request.body,
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
  app.get(songPlaylistApi, function (request, response) {
    _newSession();

    response.send(songListRelative);
    _printLog('Song <> Playlist retrieved: ' + statusCode.ok);
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