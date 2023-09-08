"use strict";

// Server URL below must point to your server, localhost works for local development/testing
const socket = io("http://13.69.199.109:3000");
/*
const roomDropdown = document.getElementById('room');
let selectedRoom;
roomDropdown.addEventListener('change', function () {
  selectedRoom = roomDropdown.value;
});
*/
document.querySelector("#newsubmit").addEventListener("submit", (event) => {
  event.preventDefault();
  const inp = document.getElementById("message");
  const usernameInp = document.getElementById("username");
  const data = {
    username: usernameInp.value,
    msg: inp.value,
    //  room: selectedRoom,
  };
  socket.emit("chat message", data);
  inp.value = "";
});

socket.on("chat message", (data) => {
  const item = document.createElement("li");
  const string = data.username + ":" + " " + data.msg;
  item.textContent = string;
  item.classList.add("mb-4", "rounded", "p-3", "text-white");
  data.username === document.getElementById("username").value
    ? item.classList.add("self-end", "bg-gmpictonblue")
    : item.classList.add("self-start", "bg-red-400");
  document.getElementById("messages").appendChild(item);
  document.getElementById("messages").scrollTop =
    document.getElementById("messages").scrollHeight;
});
