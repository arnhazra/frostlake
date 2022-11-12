//Import Statements
const express = require('express')
const identity = require('../middlewares/identity')
const WorkspaceModel = require('../models/WorkspaceModel')
const router = express.Router()

//Dashboard Route
router.get(
    '/',

    identity,

    async (req, res) => {
        try {
            const workspaces = await WorkspaceModel.find({ owner: req.id }).sort({ lastopened: -1 }).select('-apikey')
            return res.status(200).json({ workspaces })
        }

        catch (error) {
            return res.status(500).json({ msg: 'Connection Error' })
        }
    }
)

//Export Statement
module.exports = router