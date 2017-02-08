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

//var http = require('http');
//http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   //response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   //response.end('Hello the fucking World!\n');
//}).listen(3000);

// Console will print the message
//console.log('Server running at http://127.0.0.1:3000/');

