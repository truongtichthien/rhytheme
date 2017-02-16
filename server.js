/** SET UP ======================== */

// create our server w/ express
var express = require('express'),
  PORT = 3000,
  server = express();

// mongoose for mongodb
var mongoose = require('mongoose'),
  // log requests to the console (express4)
  morgan = require('morgan');

// pull information from HTML POST (express4)
var bodyParser = require('body-parser'),
  // simulate DELETE and PUT (express4)
  methodOverride = require('method-override');

/** CONFIGURATION ================= */

// connect to mongoDB database on modulus.io
//mongoose.connect('mongodb://myUserAdmin:abc123@127.0.0.1:27017/admin');

// set the static files location /public/img will be /img for users
server.use(express.static(__dirname + '/public'));

// log every request to the console
//server.use(morgan('dev'));

// parse serverlication/x-www-form-urlencoded
//server.use(bodyParser.urlencoded({'extended':'true'}));

// parse serverlication/json
//server.use(bodyParser.json());

// parse serverlication/vnd.api+json as json
//server.use(bodyParser.json({ type: 'serverlication/vnd.api+json' }));

//server.use(methodOverride());

server.get('/', function (req, res) {
  res.send('Hello World!')
});

server.get('/test', function (req, res) {
  res.send('Hello the fucking World!')
});

/** listen (start server with node server.js) ====================================== */
server.listen(PORT);
console.log('\n=============================');
console.log('Server listening on port', PORT);
console.log('=============================\n');