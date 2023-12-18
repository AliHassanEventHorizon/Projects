const express = require("express");
const socketIo = require("socket.io");
const cors = require('cors');
const serverless = require('serverless-http');
const router = express.Router()
const app = express();
app.use(cors());


const io = socketIo(app, {
  cors: {
    origin: "*",
  },
});

router.get("/Server", (req, res) => {
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
});



module.exports.handler = serverless(app);
