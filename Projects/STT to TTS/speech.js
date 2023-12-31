const { exec, execSync } = require("child_process")
const express = require("express")
const app = express()
const http = require("http").createServer(app)
const sock = require("socket.io")
const io = sock(http)

http.listen(5000)


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/speech.html");
  });

io.on("connection" , (socket)=>{
socket.on("Signal" ,(data)=>{
const Voice = data.voice
const espeak = data.Espeak
console.log(Voice)
console.log(espeak)
if (espeak == "False"){
    execSync("echo"+ " "+ Voice + " " + "| festival --tts")
}
else if (espeak === "True"){
    execSync("espeak"+ " " + "'" + Voice +"'")
}

})
})