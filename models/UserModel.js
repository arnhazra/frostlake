const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    accessToken: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

module.exports = UserModel = mongoose.model('user', UserSchema)