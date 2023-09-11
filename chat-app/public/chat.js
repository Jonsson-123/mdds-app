'use strict';

// Server URL below must point to your server, localhost works for local development/testing
const socket = io('https://joonasvm.northeurope.cloudapp.azure.com');
//const socket = io('http://localhost:3000');
const messagesElement = document.getElementById('messages');

const roomDropdown = document.getElementById('room');
let selectedRoom = roomDropdown.value;

socket.on('connect', () => {
  socket.emit('join room', selectedRoom);
});

socket.on('disconnect', () => {
  socket.emit('leave room', selectedRoom);
});

roomDropdown.addEventListener('change', function () {
  // Leave previous room
  socket.emit('leave room', selectedRoom);
  selectedRoom = roomDropdown.value;
  // Clear previous messages
  while (messagesElement.firstChild) {
    messagesElement.removeChild(messagesElement.firstChild);
  }
  // Join a new room
  socket.emit('join room', selectedRoom);
});

document.querySelector('#newsubmit').addEventListener('submit', (event) => {
  event.preventDefault();
  const inp = document.getElementById('message');
  const usernameInp = document.getElementById('username');
  const data = {
    username: usernameInp.value,
    msg: inp.value,
    room: selectedRoom,
  };
  socket.emit('chat message', data);
  inp.value = '';
});

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  const string = data.username + ':' + ' ' + data.msg;
  item.textContent = string;
  item.classList.add('mb-4', 'rounded', 'p-3', 'text-white');
  data.username === document.getElementById('username').value
    ? item.classList.add('self-end', 'bg-gmpictonblue')
    : item.classList.add('self-start', 'bg-red-400');
  messagesElement.appendChild(item);
  messagesElement.scrollTop = messagesElement.scrollHeight;
});

socket.on('previous messages', (data) => {
  data.messages.forEach((dataElement) => {
    const item = document.createElement('li');
    const string = dataElement.username + ':' + ' ' + dataElement.msg;
    item.textContent = string;
    item.classList.add('mb-4', 'rounded', 'p-3', 'text-white');
    dataElement.username === document.getElementById('username').value
      ? item.classList.add('self-end', 'bg-gmpictonblue')
      : item.classList.add('self-start', 'bg-red-400');
    messagesElement.appendChild(item);
    messagesElement.scrollTop = messagesElement.scrollHeight;
  });
});
