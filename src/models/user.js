class User {

    constructor(id, username, room) {
        this._id = id
        this._username = username
        this._room = room
    }
    get id() {
        return this._id
    }
    set id(id) {
        this._id = id
    }
    get username() {
        return this._username.trim().toLowerCase()
    }
    get room() {
        return this._room.trim().toLowerCase()
    }
    set username(name) {
        this._username = name
    }
    set room(room) {
        this._room = room
    }

    isValid() {
        return this.username && this.room

    }
    isExist(users) {
        return users.find((user) => {
            return user.username === this.username && user.room === this.room
        })
    }
    toObject() {
        return {
            id: this._id,
            username: this.username,
            room: this.room

        }
    }

}
module.exports = User




