const express = require("express");
const bodyParser = require("body-parser");
const http = require("http"); 
const socketIo = require("socket.io");
const app = express();
const cors = require('cors');
const home = require("./routes/home")

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let messageforward = "";
let seacondcomming = "";
app.use('/home', home)

io.on("connection", (socket) => {
    socket.on("transferControl", (data) => {
        let receivedData = data.Messagedata;
        messageforward = receivedData;

        if (messageforward != "") {
            console.log("First Signal", messageforward);
            io.emit("Transmission", { firstsignal: messageforward });
            messageforward = "";
        }
    });

    socket.on("CalltotheHorizon", (data) => {
        let HorzonSignal = data.Seacondmessagedata;
        seacondcomming = HorzonSignal;

        if (seacondcomming != "") {
            console.log("Seacond Signal", seacondcomming);
            io.emit("Horizonresponse", { seacondsignal: seacondcomming });
            seacondcomming = "";
        }
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log("Server is listening");
});
