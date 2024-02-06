require('dotenv').config()
const express = require('express');
const cors = require('cors')
const { Server } = require("socket.io");
const http = require('http');
const mongoose = require('mongoose');
//const auth = require('./routes/v1/auth/auth');
//const register = require('./routes/v1/auth/register');
const router = express.Router()





const app = express();
app.use(express.json())
app.use(cors({origin: ['http://localhost:3000', 'http://127.0.0.1:3000']}))
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 8000;
// const socket_port = process.env.SOCKET_PORT || 9000;
const mongo_uri = process.env.MONGODB_URI;



//app.use('/api/v1/auth/register', register);

app.get("/",(req,res,next)=>{ 
    res.send("Welcome to node server") 
}) 


let onlineUsers = []

io.on('connection', (socket) => {
    console.log('client connected io-socket', socket.id)

    socket.on('new-user', (user) => {
        console.log('Adding onlineuser')
        if (onlineUsers.findIndex(item => item.id === user?._id) === -1) {
            onlineUsers.push({
                uid: user?._id,
                email: user?.email,
                username: user?.username,
                socketId: socket.id
            })
        }

        io.emit('getOnlineUsers', onlineUsers)
        io.emit('online-users', onlineUsers)

        console.log('Online users from socket.io', onlineUsers)

    })


    socket.on('new-message', (data) => {
        console.log('new msg received on server')
        //we get members from chat id and send message to all of them
        //io.to(socketId).emit('getNewMessage',(data)=>{}) 
        io.emit('new-message', data)
    })


    socket.on('new-chat', (data) => {
        console.log('new chat received on server')
        io.emit('new-chat', data)
    })


    socket.on("room:join", (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        io.to(room).emit("user:joined", { email, id: socket.id });
        socket.join(room);
        io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });


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
//io.listen(socket_port)

mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB') })
    .catch((err) => { console.log('Error while connecting mongodb ' + err.message) })