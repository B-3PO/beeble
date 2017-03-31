var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
var port = 8080;
var ipaddress = '0.0.0.0';
var server = http.createServer(app);
server.listen(port, ipaddress, function (){
  console.log('Server Listening on port: 8080');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../dev-apps')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(express.static(path.join(__dirname, '../dev')));
app.use(express.static(path.join(__dirname, '../integrations')));


// app.use('/auth', authorizeRoute);
