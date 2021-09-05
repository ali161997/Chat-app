const express = require('express')
const path = require('path');
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words');
const Message = require('./models/message')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./models/operation');
const User = require('./models/user');
const admin = 'Admin'
const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {

    //  console.log('new web socket')
    //send welcome message for all new users
    //socket.emit =>emit an event to specific client
    //io.emit =>emit an event to every connected clients
    //socket.broadcast.emit=>emit an event to every connected clients except that client
    //io.to.emit =>emit an event to specific room
    //socket.broadcast.to.emit //emit an event to specific room except specific client


    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser(new User(socket.id, username, room))
        if (error) {
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', new Message(admin, `Welcome!`).message)
        //broadcast to all user join specific room
        socket.broadcast.to(user.room).emit('message', new Message(admin, `${user.username} has joined`).message)
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

    })


    //recieve message from client
    socket.on('sendMessage', (message, callback) => {

        let filter = new Filter()
        const user = getUser(socket.id)
        if (user) {
            if (filter.isProfane(message)) {
                return callback('profane words not accepted')
            }
            //send message for all other users

            io.to(user.room).emit('message', new Message(user.username, message).message)
            //send ack
            callback()
        }
    })


    socket.on('share-location', (location, callback) => {
        const user = getUser(socket.id)
        let url = `https://google.com/maps?q=${location.latitude},${location.longitude}`
        io.to(user.room).emit('share-location', new Message(user.username, url).message)
        callback()

    })
    socket.on('disconnect', () => {

        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', new Message(admin, `${user.username} has left`).message)
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(process.env.PORT, () => {
    console.log('app started')
})