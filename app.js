var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);

var io  = require('socket.io').listen(server);

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var usernames = {};

io.sockets.on('connection', function(socket) {
  
  socket.on('sendchat', function(data) {
    io.sockets.emit('updatechat', socket.username, data);
  });

  socket.on('adduser', function(username) {
  	if( !usernames[username] ) {
    	socket.username = username;
    	usernames[username] = username;
    	socket.emit('chatstart');
    	socket.emit('updatechat', 'SERVER', 'you have connected');
    	socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    	io.sockets.emit('updateusers', usernames);
	} else {
		socket.emit('sameusername');
	}
  });

  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});

