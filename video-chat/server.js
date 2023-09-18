'use strict'; // Enable strict mode for better error handling and code quality.

// Import necessary modules and libraries.
const express = require('express'); // Express framework for creating HTTP server.
const http = require('http'); // HTTP module for creating the server.
const socket = require('socket.io'); // Socket.io for real-time communication.
const app = express(); // Create an Express application.
const server = http.createServer(app); // Create an HTTP server using Express.
const io = socket(server); // Create a Socket.io server on top of HTTP server.

const rooms = {}; // Object to store information about rooms and their users.

// Event handler for when a client connects to the Socket.io server.
io.on('connection', (socket) => {
  // Event handler when a client wants to join a room.
  socket.on('join room', (roomId) => {
    // Check if the room exists.
    if (rooms[roomId]) {
      // If the room exists, add the current socket (user) to the room.
      rooms[roomId].push(socket.id);
    } else {
      // If the room doesn't exist, create it and add the current socket (user).
      rooms[roomId] = [socket.id];
    }

    // Find another user in the same room (if any).
    const otherUser = rooms[roomId].find((id) => id !== socket.id);

    if (otherUser) {
      // If another user is found, inform the current user about them.
      socket.emit('other user', otherUser); // Emit an event to the current user.
      socket.to(otherUser).emit('user joined', socket.id); // Emit an event to the other user.
    }
  });

  socket.on('offer', (payload) => {
    io.to(payload.target).emit('offer', payload);
  });

  socket.on('answer', (payload) => {
    io.to(payload.target).emit('answer', payload);
  });
  socket.on('ice-candidate', (incoming) => {
    io.to(incoming.target).emit('ice-candidate', incoming);
  });
});

// Start the HTTP server and listen on port 8000.
server.listen(8000, () => console.log('server is running on port 8000'));
