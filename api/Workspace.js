//Import Statements
const express = require('express')
const { check, validationResult } = require('express-validator')
const crypto = require('crypto')
const authorize = require('../middlewares/authorize')
const WorkspaceModel = require('../models/WorkspaceModel')
const AnalyticsModel = require('../models/AnalyticsModel')
const router = express.Router()

//Create Workspace Route
router.post(
    '/create',

    authorize,

    [
        check('name', 'Workspace Name must be within 3 & 10 letters').isLength({ min: 3, max: 10 })
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            const { name } = req.body

            try {
                const count = await WorkspaceModel.find({ owner: req.id }).count()

                if (count < 10) {
                    const apikey = crypto.randomBytes(16).toString('hex')
                    const status = 'live'
                    const lastopened = Date.now()
                    const workspace = new WorkspaceModel({ owner: req.id, name, apikey, status, lastopened })
                    await workspace.save()
                    return res.status(200).json({ msg: 'New Workspace Created', workspace })
                }

                else {
                    return res.status(400).json({ msg: 'Workspace Limit Reached, Max 10 Workspaces Can Be Created' })
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Error Creating Workspace' })
            }
        }
    }
)

//Workspace Dashboard Route
router.post(
    '/dashboard',

    authorize,

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

//Workspace Storage Route
router.post(
    '/storage',

    authorize,

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

//View Workspace Route
router.post(
    '/view/:id',

    authorize,

    async (req, res) => {
        try {
            const workspace = await WorkspaceModel.findById(req.params.id)
            const { id, owner } = workspace
            const workspaceid = id
            const analytics = await AnalyticsModel.find({ workspaceid, owner }).sort({ date: -1 })

            if (owner.toString() === req.id) {
                const lastopened = Date.now()
                await WorkspaceModel.findByIdAndUpdate(req.params.id, { lastopened })
                return res.status(200).json({ workspace, analytics })
            }

            else {
                return res.status(404).json({ msg: 'Workspace Not Found' })
            }
        }

        catch (error) {
            return res.status(404).json({ msg: 'Workspace Not Found' })
        }
    }
)

//Change Workspace State Route
router.post(
    '/changestatus/:id',

    authorize,

    async (req, res) => {
        try {
            const workspace = await WorkspaceModel.findById(req.params.id)

            if (workspace.owner.toString() === req.id) {
                if (workspace.status === 'live') {
                    const status = 'off'
                    await WorkspaceModel.findByIdAndUpdate(req.params.id, { status })
                    return res.status(200).json({ msg: 'Workspace was turned off' })
                }

                else {
                    const status = 'live'
                    await WorkspaceModel.findByIdAndUpdate(req.params.id, { status })
                    return res.status(200).json({ msg: 'Workspace is live now' })
                }
            }

            else {
                return res.status(404).json({ msg: 'Workspace Not Found' })
            }
        }

        catch (error) {
            return res.status(404).json({ msg: 'Workspace Not Found' })
        }
    }
)

//Delete Workspace Route
router.delete(
    '/delete/:id',

    authorize,

    async (req, res) => {
        try {
            const workspace = await WorkspaceModel.findById(req.params.id)

            if (workspace.owner.toString() === req.id) {
                await AnalyticsModel.deleteMany({ owner: req.id, workspaceid: req.params.id })
                await workspace.remove()
                return res.status(200).json({ msg: 'Workspace Deleted' })
            }

            else {
                return res.status(404).json({ msg: 'Workspace Not Found' })
            }
        }

        catch (err) {
            return res.status(404).json({ msg: 'Workspace Not Found' })
        }
    }
)

//Clear Workspace Data Route
router.delete(
    '/cleardata/:id',

    authorize,

    async (req, res) => {
        try {
            const workspace = await WorkspaceModel.findById(req.params.id)
            await AnalyticsModel.deleteMany({ owner: req.id, workspaceid: req.params.id })

            if (workspace.owner.toString() === req.id) {
                await AnalyticsModel.deleteMany({ owner: req.id, workspaceid: req.params.id })
                return res.status(200).json({ msg: 'Workspace Data Cleared' })
            }

            else {
                return res.status(404).json({ msg: 'Workspace Not Found' })
            }
        }

        catch (err) {
            return res.status(404).json({ msg: 'Workspace Not Found' })
        }
    }
)

//Export Statement
module.exports = router