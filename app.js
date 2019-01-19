const express = require('express');
var app = express();

const {
  generateMessage,
  generateLocationMessage
} = require('./public/routesJs/message');

const {
  isRealString
} = require('./public/routesJs/validation');
const {
  Users
} = require('./public/routesJs/users');

var users = new Users();

const port = process.env.PORT || 8000;
var server = require('http').createServer(app);
const socketIO = require('socket.io');
app.use(express.static(__dirname + "/public"));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New User has been created!');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });


  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback('This is from server');
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

});

server.listen(port, () => {
  console.log(`Server has been started! on ${port}`);
});