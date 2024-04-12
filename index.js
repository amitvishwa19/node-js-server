require('dotenv').config()
const express = require('express');
const cors = require('cors')
const http = require('http');
const parseUrl = require('body-parser');
const cookieparser = require('cookie-parser')
const mongoose = require('mongoose');
const {
    socetConnection,
    handleConnectedUser,
    handleNewChat,
    handleNewMessage,
    handleDisconnectedUser
} = require('./services/socket');

const authRoutes = require('./routes/v1/auth')


const port = process.env.PORT || 8000;
const mongo_uri = process.env.MONGODB_URI;














const app = express();
app.use(express.json())
app.use(cookieparser())
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }))
const server = http.createServer(app);



let onlineUsers = []





//app.use('/api/v1/auth/register', register);

app.use('/api/v1/auth/', authRoutes)

app.get("/", (req, res, next) => {
    res.send("Welcome to node server")
})



const io = socetConnection(server)
io.on('connection', (socket) => {
    console.log('client connected io-socket', socket.id)

    handleConnectedUser(io, socket)
    handleNewChat(io, socket)
    handleNewMessage(io, socket)
    handleDisconnectedUser(io, socket)





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





});

io.on('disconnect', () => {

})

server.listen(port, () => { console.log(`Servrt running on port ${port}`) });


mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log('Connected to MongoDB') })
    .catch((err) => { console.log('Error while connecting mongodb ' + err.message) })