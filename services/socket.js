const { Server } = require("socket.io");

let onlineUsers = []

function socetConnection(server) {

    return new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
}

function handleConnectedUser(io, socket) {
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
}

function handleNewChat(io, socket) {
    socket.on('new-chat', (data) => {
        console.log('new chat received on server')
        io.emit('new-chat', data)
    })
}

function handleNewMessage(io, socket) {
    socket.on('new-message', (message) => {
        //console.log('new msg received on server', message?.otherMembers)

        // message?.otherMembers.forEach((user) => {
        //     console.log('msg members', user?._id)
        //     //     onlineUsers.some((usr) => usr.uid === user ) &&  console.log(`will emmit new message to ${user}`)
        //     //onlineUsers.some((usr) => usr.uid !== message?.currentUserId) && console.log(`will emmit new message to ${message?.currentUserId}`)
        //     const omem = onlineUsers.filter((usr) => { usr.uid !== user?._id })

        //     onlineUsers.forEach((usr) => {
        //         console.log('online users', usr.uid)
        //         if (usr.uid === user?._id) {
        //             console.log(`message will emit to ${usr.uid}`)
        //         }
        //     })
        // });

        io.emit('new-message', message)
    })
}

function handleDisconnectedUser(io, socket) {
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        io.emit('getOnlineUsers', onlineUsers)
        console.log('onlineUsers', onlineUsers)
    })
}


module.exports = {
    socetConnection,
    handleConnectedUser,
    handleNewChat,
    handleNewMessage,
    handleDisconnectedUser
}