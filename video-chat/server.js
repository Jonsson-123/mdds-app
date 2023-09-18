// Import necessary modules
require('dotenv').config;
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);
const path = require('path');

// Create an object to store rooms and their associated users
const rooms = {};

// Handle WebSocket connections when a client connects
io.on('connection', (socket) => {
  // Handle when a user joins a room
  socket.on('join room', (roomID) => {
    // Check if the room exists, and if not, create it
    if (rooms[roomID]) {
      rooms[roomID].push(socket.id);
    } else {
      rooms[roomID] = [socket.id];
    }

    // Find the other user in the room
    const otherUser = rooms[roomID].find((id) => id !== socket.id);

    // If another user is found, emit 'other user' and 'user joined' events
    if (otherUser) {
      socket.emit('other user', otherUser);
      socket.to(otherUser).emit('user joined', socket.id);
    }
  });

  // Handle when a user sends an offer
  socket.on('offer', (payload) => {
    // Emit the 'offer' event to the target user
    io.to(payload.target).emit('offer', payload);
  });

  // Handle when a user sends an answer
  socket.on('answer', (payload) => {
    // Emit the 'answer' event to the target user
    io.to(payload.target).emit('answer', payload);
  });

  // Handle ICE candidate exchange
  socket.on('ice-candidate', (incoming) => {
    // Emit the 'ice-candidate' event to the target user
    io.to(incoming.target).emit('ice-candidate', incoming.candidate);
  });
});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, './client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
}

const port = process.env.PORT || 8000;
// Start the server on port 8000 or env data

server.listen(port, () => console.log('Server is running on port 8000'));
