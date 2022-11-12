//Import Statements
const express = require('express')
const { body, header } = require('express-validator')
const { validationResult } = require('express-validator')
const WorkspaceModel = require('../models/WorkspaceModel')
const AnalyticsModel = require('../models/AnalyticsModel')
const router = express.Router()

//Create Analytics Route
router.post(
    '/create',

    [
        body('component', 'Component name must not be empty & must be within 20 chars').notEmpty().isLength({ min: 1, max: 20 }),
        body('event', 'Event must not be empty & must be within 15 chars').notEmpty().isLength({ min: 1, max: 15 }),
        body('info', 'Info must not be empty & must be within 50 chars').notEmpty().isLength({ min: 1, max: 50 }),
        body('statusCode', 'Status must not be empty & must be within 5 chars').notEmpty().isLength({ min: 1, max: 5 }),
        header('x-workspace-id', 'Include x-workspace-id in headers').notEmpty(),
        header('x-api-key', 'Include x-api-key in headers').notEmpty()
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            const { component, event, info, statusCode } = req.body
            const ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress

            try {
                const workspaceid = req.headers['x-workspace-id']
                const apikey = req.headers['x-api-key']
                const workspace = await WorkspaceModel.findById(workspaceid)
                const owner = workspace.owner
                const existingAnalyticsDataCount = await AnalyticsModel.find({ owner }).countDocuments()
                if (workspace.apikey === apikey) {
                    if (existingAnalyticsDataCount < 30000) {
                        if (workspace.status === 'live') {
                            let analytics = new AnalyticsModel({ owner, workspaceid, component, event, info, statusCode, ipaddress })
                            await analytics.save()
                            return res.status(200).json({ msg: 'Analytics created' })
                        }

                        else {
                            return res.status(400).json({ msg: 'Workspace is not live, turn on the workspace first' })
                        }
                    }

                    else {
                        return res.status(500).json({ msg: 'Analytics could not be created due to insufficient credits' })
                    }
                }

                else {
                    return res.status(400).json({ msg: 'Invalid api key or workspace id' })
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
)

//Export Statement
module.exports = router