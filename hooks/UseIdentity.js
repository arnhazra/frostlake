//Import Statements
const express = require('express')
const identity = require('../middlewares/identity')
const UserModel = require('../models/UserModel')
const router = express.Router()

//Use Identity Hook Route
router.get(
    '/',

    identity,

    async (req, res) => {
        try {
            const user = await UserModel.findById(req.id).select('-password').select('-date')

            if (user) {
                return res.status(200).json({ user })
            }

            else {
                return res.status(401).json({ msg: 'Unauthorized' })
            }
        }

        catch (error) {
            return res.status(500).json({ msg: 'Connection Error' })
        }
    }
)

//Export Statement
module.exports = router