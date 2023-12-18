const express = require("express");
const socketIo = require("socket.io");
const cors = require('cors');
const serverless = require('serverless-http');

const app = express();
app.use(cors());

// Attach Socket.IO directly to the app
const io = socketIo(app, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello, serverless!");
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("transferControl", (data) => {
    const receivedData = data.Messagedata;
    console.log("First Signal", receivedData);

    io.emit("Transmission", { firstsignal: receivedData });
  });

  socket.on("CalltotheHorizon", (data) => {
    const HorizonSignal = data.Seacondmessagedata;
    console.log("Seacond Signal", HorizonSignal);

    io.emit("Horizonresponse", { seacondsignal: HorizonSignal });
  });
});

// Convert the app to a serverless function
module.exports.handler = serverless(app);
