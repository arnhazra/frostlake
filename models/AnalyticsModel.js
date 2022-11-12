const mongoose = require('mongoose')

const AnalyticsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    workspaceid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'workspace'
    },

    component: {
        type: String,
        required: true
    },

    event: {
        type: String,
        required: true
    },

    info: {
        type: String,
        required: true
    },

    statusCode: {
        type: String,
        required: true
    },

    ipaddress: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

module.exports = Analytics = mongoose.model('analytics', AnalyticsSchema)