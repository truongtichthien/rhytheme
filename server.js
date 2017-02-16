// set up ========================
var express = require('express');
var server = express();                               // create our server w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

//mongoose.connect('mongodb://myUserAdmin:abc123@127.0.0.1:27017/admin');     // connect to mongoDB database on modulus.io

server.use(express.static(__dirname + '/public'), function(req, res, next) {
	console.log(req);
	next();
});                 // set the static files location /public/img will be /img for users
//server.use(morgan('dev'));                                         // log every request to the console
//server.use(bodyParser.urlencoded({'extended':'true'}));            // parse serverlication/x-www-form-urlencoded
//server.use(bodyParser.json());                                     // parse serverlication/json
//server.use(bodyParser.json({ type: 'serverlication/vnd.api+json' })); // parse serverlication/vnd.api+json as json
//server.use(methodOverride());

server.get('/', function (req, res) {
  res.send('Hello World!')
});

server.get('/test', function (req, res) {
  res.send('Hello the fucking World!')
});

// listen (start server with node server.js) ======================================
server.listen(3000);
console.log("server listening on port 3000");