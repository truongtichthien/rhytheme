(function (_req) {
  /** SET UP ======================== */

  // create onw server express
  var express = _req('express'),
    PORT = process.env.PORT || 3300,
    server = express();

  var path = _req('path');

  // mongoose for mongodb
  var mongoose = _req('mongoose'),
    // log requests to the console (express4)
    morgan = _req('morgan');

  var Todo = mongoose.model('testCollection', {
    text: String,
  });

  // pull information from HTML POST (express4)
  var bodyParser = _req('body-parser'),
    // simulate DELETE and PUT (express4)
    methodOverride = _req('method-override');

  //noinspection JSUnresolvedVariable
  /** CONFIGURATION ================= */

  // connect to mongoDB database on modulus.io
  // mongoose.connect('mongodb://admin:abc123@127.0.0.1:27017/test');

  // set the static files location /public/img will be /img for users

  server.use(express.static(path.join(__dirname, '/src'), { index: false }));

  // log every request to the console
  server.use(morgan('dev'));

  // parse serverlication/x-www-form-urlencoded
  //server.use(bodyParser.urlencoded({'extended':'true'}));

  // parse serverlication/json
  /** parse request JSON */
  server.use(bodyParser.json());

  // parse serverlication/vnd.api+json as json
  // server.use(bodyParser.json({ type: 'serverlication/vnd.api+json' }));

  // server.use(methodOverride());

  // server.get('/', function (req, res) {
  //   res.redirect('/rhytheme');
  // });

  server.get('/', function (req, res) {
    _printConsole(__dirname);
    res.sendFile('index.html', { root: __dirname + '/src' });
  });

  // server.get('/demo', function (req, res) {
  //   res.sendFile('demo.html', { root: __dirname + '/src' });
  // });

  // server.get('/esg', function (req, res) {
  //   res.sendFile('index.html', { root: __dirname + '/src/scripts/app/esg' });
  // });

  // server.get('/httk', function (req, res) {
  //   res.sendFile('index.html', { root: __dirname + '/src/scripts/modules/httk' });
  // });

  // server.get('/httk/*', function (req, res) {
  //   console.log('day ne');
  //   res.redirect('/httk');
  // });

  server.get('*', function (req, res) {
    console.log('not found');
    res.redirect('/rhytheme');
    // res.redirect('/demo');
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
    Todo.create(
      {
        text: req.body.string,
        done: false,
      },
      function (err, todos) {
        console.log('create');

        if (err) {
          res.send(err);
        }

        // get and return all the todos after you create another
        Todo.find(function (err, todos) {
          if (err) {
            res.send(err);
          }
          console.log(todos);
        });
      },
    );

    // var result = JSON.stringify(req);
    res.send(req.body);
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
})(require);
