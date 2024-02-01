require('dotenv').config()
const express = require('express');
const cors = require('cors')
const { Server } = require("socket.io");
const http = require('http');
const mongoose = require('mongoose');
const auth = require('./routes/v1/auth/auth');
//const register = require('./routes/v1/auth/register');






const app = express();
app.use(express.json())
app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 8000;
const socket_port = process.env.SOCKET_PORT || 9000;
const mongo_uri = process.env.MONGODB_URI;


app.use('/api/v1/auth', auth);
//app.use('/api/v1/auth/register', register);














app.get('/api/v1/chat', (req, res) => {
    if (!res.socket.server.io) {
        console.log('*First use, starting Socket.IO');
        const io = new Server(res.socket.server);

        // Listen for connection events
        io.on('connection', (socket) => {
            console.log(`Socket ${socket.id} connected.`);

            // Listen for incoming messages and broadcast to all clients
            socket.on('myevent', (data) => {
                socket.emit('responseEvent', 'Hwllo client from server');
            });

            // Clean up the socket on disconnect
            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected.`);
            });
        });
        res.socket.server.io = io;
    }
    res.end();
    res.send('Welcome to chat')
});


let onlineUsers = []

io.on('connection', (socket) => {
    console.log('socket-id', socket.id)

    socket.on('addNewUser', (uid) => {

        if (onlineUsers.findIndex(item => item.uid === uid) === -1) {
            onlineUsers.push({
                uid,
                socketId: socket.id
            })
        }

        io.emit('getOnlineUsers', onlineUsers)

        console.log('Online users from socket.io', onlineUsers)

    })

    socket.on('myevent', (data) => {
        console.log('Client', data)
        socket.emit('responseEvent', 'Hwllo client from server');
    });


    //Sending new message
    socket.on('newMessage',(data)=>{
        console.log('new msg received',data)
        //we get members from chat id and send message to all of them
        //io.to(socketId).emit('getNewMessage',(data)=>{}) 
        io.emit('newMessage',data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        io.emit('getOnlineUsers', onlineUsers)
        console.log('onlineUsers', onlineUsers)
    })


});

io.on('disconnect', () => {

})

server.listen(port, () => { console.log(`Servrt running on port ${port}`) });
io.listen(socket_port)

mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB') })
    .catch((err) => { console.log('Error while connecting mongodb ' + err.message) })