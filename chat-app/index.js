"use strict";

const lastTenMessages = [];

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
  });

  socket.on("chat message", (data) => {
    console.log("message: ", data.msg);
    console.log("username: ", data.username);
    //   io.in("data.room").emit(/* ... */);
    io.emit("chat message", data);
  });
});

http.listen(3000, () => {
  console.log("listening on port 3000");
});
