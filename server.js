var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/test', function (req, res) {
  res.send('Hello the fucking World!')
});

app.listen(3000, function () {
  //console.log('Example app listening on port 3000!')
  console.log('Server running at http://127.0.0.1:3000/');
});