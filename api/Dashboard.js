//Import Statements
const express = require('express')
const identity = require('../middlewares/identity')
const InstanceModel = require('../models/InstanceModel')
const router = express.Router()

//Dashboard Route
router.get(
    '/',

    identity,

    async (req, res) => {
        try {
            const instances = await InstanceModel.find({ owner: req.id }).sort({ lastopened: -1 }).select('-apikey')
            return res.status(200).json({ instances })
        }

        catch (error) {
            return res.status(500).json({ msg: 'Connection Error' })
        }
    }
)

//Export Statement
module.exports = router