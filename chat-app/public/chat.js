"use strict";

// Server URL below must point to your server, localhost works for local development/testing
const socket = io("http://localhost:3000");
const roomDropdown = document.getElementById("room");
let selectedRoom;
roomDropdown.addEventListener("change", function () {
  selectedRoom = roomDropdown.value;
  alert(selectedRoom);
  socket.emit("change room", selectedRoom);
});

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const inp = document.getElementById("message");
  const usernameInp = document.getElementById("username");
  const data = {
    username: usernameInp.value,
    msg: inp.value,
  };
  socket.emit("chat message", data);
  usernameInp.value = "";
  inp.value = "";
});

socket.on("chat message", (data) => {
  const item = document.createElement("li");
  item.textContent = data.username + ": " + data.msg;
  console.log(data);
  document.getElementById("messages").appendChild(item);
});
