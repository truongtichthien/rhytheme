/** SET UP ======================== */

var express = require('express');
var PORT = process.env.PORT || 3300;
var server = express();
var path = require('path');

// pull information from HTML POST (express4)
var bodyParser = require('body-parser');

/** CONFIGURATION ================= */

// set the static files location /public/img will be /img for users
server.use(express.static(path.join(__dirname, '/src'), { index: false }));

// log every request to the console
server.use(morgan('dev'));

// parse serverlication/json
server.use(bodyParser.json());

server.get('/', function (req, res) {
  _printConsole(__dirname);
  res.sendFile('index.html', { root: path.join(__dirname, '/src') });
});

server.get('*', function (req, res) {
  res.redirect('/');
});

/** SERVER EXECUTION ============== */

server.listen(PORT);

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
    message: msg,
  };
}

module.exports = server;
