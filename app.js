const express = require('express');
var app = express();
const {
  generateMessage,
  generateLocationMessage
} = require('./public/routesJs/message');
const port = process.env.PORT || 3000;
var server = require('http').createServer(app);
const socketIO = require('socket.io');
app.use(express.static(__dirname + "/public"));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New User has been created!');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('This is from server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

});

server.listen(port, () => {
  console.log('Server has been started!');
});