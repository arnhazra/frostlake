const mongoose = require('mongoose')

const WorkspaceSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    name: {
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

module.exports = WorkspaceModel = mongoose.model('workspace', WorkspaceSchema)