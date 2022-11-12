//Import Statements
const express = require('express')
const { check, validationResult } = require('express-validator')
const crypto = require('crypto')
const identity = require('../middlewares/identity')
const InstanceModel = require('../models/InstanceModel')
const AnalyticsModel = require('../models/AnalyticsModel')
const router = express.Router()

//Create Instance Route
router.post(
    '/create',

    identity,

    [
        check('instancename', 'Instance Name must be within 3 & 10 letters').isLength({ min: 3, max: 10 })
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            const { instancename } = req.body

            if (instancename.toLowerCase() === 'frostlake') {
                return res.status(400).json({ msg: 'Frostlake is a Reserved Instance Name' })
            }

            else {
                try {
                    const count = await InstanceModel.find({ owner: req.id }).count()

                    if (count < 100) {
                        const apikey = crypto.randomBytes(16).toString('hex')
                        const status = 'live'
                        const lastopened = Date.now()
                        const instance = new InstanceModel({ owner: req.id, instancename, apikey, status, lastopened })
                        await instance.save()
                        return res.status(200).json({ msg: 'New Instance Created', instance })
                    }

                    else {
                        return res.status(400).json({ msg: 'Instance Limit Reached, Max 100 Instances Can Be Created' })
                    }
                }

                catch (error) {
                    return res.status(500).json({ msg: 'Error Creating Instance' })
                }
            }
        }
    }
)

//View Instance Route
router.get(
    '/view/:id',

    identity,

    async (req, res) => {
        try {
            const instance = await InstanceModel.findById(req.params.id)
            const { id, owner } = instance
            const instanceid = id
            const analytics = await AnalyticsModel.find({ instanceid, owner }).sort({ date: -1 })

            if (owner.toString() === req.id) {
                const lastopened = Date.now()
                await InstanceModel.findByIdAndUpdate(req.params.id, { lastopened })
                return res.status(200).json({ instance, analytics })
            }

            else {
                return res.status(404).json({ msg: 'Instance Not Found' })
            }
        }

        catch (error) {
            return res.status(404).json({ msg: 'Instance Not Found' })
        }
    }
)

//Change Instance State Route
router.get(
    '/changestatus/:id',

    identity,

    async (req, res) => {
        try {
            const instance = await InstanceModel.findById(req.params.id)

            if (instance.owner.toString() === req.id) {
                if (instance.status === 'live') {
                    const status = 'off'
                    await InstanceModel.findByIdAndUpdate(req.params.id, { status })
                    return res.status(200).json({ msg: 'Instance was turned off' })
                }

                else {
                    const status = 'live'
                    await InstanceModel.findByIdAndUpdate(req.params.id, { status })
                    return res.status(200).json({ msg: 'Instance is live now' })
                }
            }

            else {
                return res.status(404).json({ msg: 'Instance Not Found' })
            }
        }

        catch (error) {
            return res.status(404).json({ msg: 'Instance Not Found' })
        }
    }
)

//Delete Instance Route
router.delete(
    '/delete/:id',

    identity,

    async (req, res) => {
        try {
            const instance = await InstanceModel.findById(req.params.id)

            if (instance.owner.toString() === req.id) {
                await AnalyticsModel.deleteMany({ owner: req.id, instanceid: req.params.id })
                await instance.remove()
                return res.status(200).json({ msg: 'Instance Deleted' })
            }

            else {
                return res.status(404).json({ msg: 'Instance Not Found' })
            }
        }

        catch (err) {
            return res.status(404).json({ msg: 'Instance Not Found' })
        }
    }
)

//Clear Instance Data Route
router.delete(
    '/cleardata/:id',

    identity,

    async (req, res) => {
        try {
            const instance = await InstanceModel.findById(req.params.id)
            await AnalyticsModel.deleteMany({ owner: req.id, instanceid: req.params.id })

            if (instance.owner.toString() === req.id) {
                await AnalyticsModel.deleteMany({ owner: req.id, instanceid: req.params.id })
                return res.status(200).json({ msg: 'Instance Data Cleared' })
            }

            else {
                return res.status(404).json({ msg: 'Instance Not Found' })
            }
        }

        catch (err) {
            return res.status(404).json({ msg: 'Instance Not Found' })
        }
    }
)

//Export Statement
module.exports = router