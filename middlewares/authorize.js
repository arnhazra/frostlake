//Import Statements
const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')
const dotenv = require('dotenv').config()

//Reading Environment Variables
const JWT_SECRET = process.env.JWT_SECRET

//Authentication Checking Middleware
module.exports = async function (req, res, next) {
    const accessToken = req.headers['authorization']?.split(' ')[1]

    if (!accessToken) {
        return res.status(401).json({ msg: 'Unauthorized Request' })
    }

    else {
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET)
            req.id = decoded.id
            const user = await UserModel.findById(decoded.id)

            if (user) {
                if (user.accessToken === '') {
                    return res.status(401).json({ msg: 'Invalid Token' })
                }

                else if (user.accessToken === accessToken) {
                    next()
                }

                else {
                    return res.status(401).json({ msg: 'Invalid Token' })
                }
            }

            else {
                return res.status(401).json({ msg: 'Invalid User' })
            }
        }

        catch (error) {
            if (error.name) {
                if (error.name === 'JsonWebTokenError' || error.name === 'SyntaxError') {
                    return res.status(401).json({ msg: 'Invalid Token' })
                }

                else {
                    return res.status(500).json({ msg: 'Connection Error' })
                }
            }

            else {
                return res.status(500).json({ msg: 'Connection Error' })
            }
        }
    }
}