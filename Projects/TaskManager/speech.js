const express = require("express")
const app = express()
const sock = require("socket.io");
const http = require("http").createServer(app)
const io = sock(http)
const cors = require("cors")
const { execSync } = require('child_process');

http.listen(5000, () => {
    console.log("Server is ready to go on port 5000");
});
app.use(cors({origin:"*"}))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/speech.html');
  });

io.on("connection",(socket)=>{
    socket.on("Signal",(data)=>{
        let text = data.voice
        console.log(text)
        execSync("echo"+ " "+ "'" + text + "'" + "| festival --tts" )
    })
})