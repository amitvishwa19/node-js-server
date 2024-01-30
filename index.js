const express = require('express');
const { Server } = require("socket.io");
const http = require('http');





const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 9001;

app.get('/dev/chat', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(port, () => {
    console.log(`listening on ${port}`);
});