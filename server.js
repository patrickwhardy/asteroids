const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', function(socket) {
  io.on('connection', function (channel, message) {
  // socket.on('message', function (channel, message) {
    io.sockets.emit("message", message)

    console.log(channel + ':', message);
    // });

    });
    socket.on('disconnect', function () {
  });
});

http.listen(process.env.PORT || 8080, function(){
  console.log('Your server is up and running on Port 8080. Good job!');
  console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);
});
