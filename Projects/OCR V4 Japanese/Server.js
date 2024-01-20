const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");
const ioClient = require('socket.io-client');
const app = express();
const server = http.createServer(app);
const ioServer = socketIo(server); 

const port = 5000;
let TextTransfer = "";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Speak.html");
});

const socket = ioClient('http://localhost:3000'); 
socket.on("transferControl", (data) => {
  let postData = data.message;
  TextTransfer = postData;
  if (TextTransfer !== "") {
    console.log(TextTransfer);
    ioServer.emit("eventHorizon", { message: TextTransfer }); 
    TextTransfer = "";
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("Server is listening");
});
