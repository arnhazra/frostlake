const mongoose = require('mongoose')

const InstanceSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    instancename: {
        type: String,
        required: true
    },

    apikey: {
        type: String,
        required: true,
        unique: true
    },

    status: {
        type: String,
        required: true
    },

    lastopened: {
        type: Number,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

module.exports = InstanceModel = mongoose.model('instance', InstanceSchema)