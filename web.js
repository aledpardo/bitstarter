
var express = require('express');
var fs = require('fs');
var buf = new Buffer('index');
//var app = express.createServer(express.logger());
var app = express();
var echo;
buf = fs.readFileSync('index.html');
echo = buf.toString();

app.get('/', function(request, response) {
  response.send( echo );
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
