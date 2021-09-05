class Message {

    constructor(username, message) {
        this._message = message
        this._username = username
    }
    getDate() {
        return new Date()
    }
    createdAt() {
        return new Date().getTime()
    }
    set message(message) {
        return this._message = message
    }
    get message() {
        return {
            username: this._username,
            message: this._message,
            createdAt: this.createdAt()

        }
    }

}
module.exports = Message