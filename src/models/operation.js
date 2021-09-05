const User = require('./user')

const users = []
const addUser = (user) => {
    if (user.isValid() && !user.isExist(users)) {
        users.push(user.toObject())
        return { user }
    }
    else return {
        error: 'user data invalid'
    }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    if (index != -1) {
        const us = users.splice(index, 1)
        return us[0]
    }
}
const getUser = (id) => {
    const user = users.find((user) => {
        return user.id == id
    })
    return user


}

const getUsersInRoom = (roomId) => {
    return users.filter(user => {
        return user.room == roomId
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}