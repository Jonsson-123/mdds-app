'use strict';

const lastTenMessages = [];

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const rooms = {}; // Dictionary to store chat rooms and their messages

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('a user disconnected', socket.id);
  });

  socket.on('chat message', (data) => {
    // Store the message in the room's message history
    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }

    rooms[data.room].push({ username: data.username, msg: data.msg });

    // Limit the number of messages to the last ten
    if (rooms[data.room].length > 10) {
      rooms[data.room].shift();
    }

    //io.in("data.room").emit(/* ... */);
    // io.emit('chat message', data); KAIKILLE

    io.to(data.room).emit('chat message', data);
  });

  socket.on('join room', (room) => {
    socket.join(room);
    console.log('user joined room' + room);

    if (rooms[room]) {
      socket.emit('previous messages', { messages: rooms[room] });
    }
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
    console.log('user left room' + room);
  });
});

http.listen(3000, () => {
  console.log('listening on port 3000');
});
