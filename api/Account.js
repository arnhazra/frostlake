//Import Statements
const express = require('express')
const identity = require('../middlewares/identity')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')
const AnalyticsModel = require('../models/AnalyticsModel')
const WorkspaceModel = require('../models/WorkspaceModel')
const router = express.Router()

//Get Account Details Route
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

//Change Password Route
router.post(
    '/changepassword',

    identity,

    [
        check('password', 'Password must be within 8 & 18 letters').isLength({ min: 8, max: 18 })
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            let { password } = req.body
            password = await bcrypt.hash(password, 12)

            try {
                await UserModel.findByIdAndUpdate(req.id, { password })
                return res.status(200).json({ msg: 'Password Changed' })
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Export Statement
module.exports = router