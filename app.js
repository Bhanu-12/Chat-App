const express = require('express');
var app = express();

const {
  generateMessage,
  generateLocationMessage
} = require('./public/routesJs/message');

const {
  isRealString
} = require('./public/routesJs/validation');

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
    // socket.leave('The Office Fans');

    // io.emit -> io.to('The Office Fans').emit
    // socket.broadcast.emit -> socket.broadcast.to('The Office Fans').emit
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });


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
  console.log(`Server has been started! on ${port}`);
});