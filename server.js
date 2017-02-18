/** SET UP ======================== */

// create our server w/ express
var express = require('express'),
  PORT = 3000,
  server = express();

// mongoose for mongodb
var mongoose = require('mongoose'),
  // log requests to the console (express4)
  morgan = require('morgan');

var Todo = mongoose.model('testCollection', {
  text: String
});

// pull information from HTML POST (express4)
var bodyParser = require('body-parser'),
  // simulate DELETE and PUT (express4)
  methodOverride = require('method-override');

/** CONFIGURATION ================= */

// connect to mongoDB database on modulus.io
mongoose.connect('mongodb://admin:abc123@127.0.0.1:27017/test');

// set the static files location /public/img will be /img for users
server.use(express.static(__dirname + '/src'));

// log every request to the console
//server.use(morgan('dev'));

// parse serverlication/x-www-form-urlencoded
//server.use(bodyParser.urlencoded({'extended':'true'}));

// parse serverlication/json
/** parse request JSON */
server.use(bodyParser.json());

// parse serverlication/vnd.api+json as json
//server.use(bodyParser.json({ type: 'serverlication/vnd.api+json' }));

// server.use(methodOverride());

server.get('/', function (req, res) {
  // res.send('Hello World!');

  res.sendFile('index.html');
});

server.get('/api/get', function (req, res) {

  Todo.find(function (err, data) {
    console.log('find');

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute

    if (err) {
      data.send(JSON.parse(JSON.stringify(err)));
    }

    console.log(data);
    res.send(JSON.parse(JSON.stringify(data)));
    // res.json(res); // return all todos in JSON format
  });

  // res.send(JSON.parse(JSON.stringify({test: 123})));

});

server.get('/api/getString', function (req, res) {
  res.send('abc');
});

server.post('/api/post', function (req, res) {
  // for (var key in req) {
  //   if (req.hasOwnProperty(key)) {
  //     console.log(key);
  //   }
  // }

  // create a todo, information comes from AJAX request from Angular
  Todo.create({
    text: req.body.string,
    done: false
  }, function (err, todos) {
    console.log('create');

    if (err) {
      res.send(err);
    }

    // get and return all the todos after you create another
    Todo.find(function (err, todos) {
      if (err) {
        res.send(err)
      }
      console.log(todos);
    });
  });

  // var result = JSON.stringify(req);
  res.send(req.body);
});

/** listen (start server with node server.js) ====================================== */
server.listen(PORT);
console.log('\n=============================');
console.log('Server listening on port', PORT);
console.log('=============================\n');