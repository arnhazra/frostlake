//Import Statements
const express = require('express')
const identity = require('../middlewares/identity')
const AnalyticsModel = require('../models/AnalyticsModel')
const WorkspaceModel = require('../models/WorkspaceModel')
const router = express.Router()

//Get Storage Details Route
router.get(
    '/getdetails',

    identity,

    async (req, res) => {
        try {
            const workspaceCount = await WorkspaceModel.find({ owner: req.id }).countDocuments()
            const analyticsDataCount = await AnalyticsModel.find({ owner: req.id }).countDocuments()
            return res.status(200).json({ workspaceCount, analyticsDataCount })
        }

        catch (error) {
            return res.status(500).json({ msg: 'Connection Error' })
        }
    }
)

//Export Statement
module.exports = router