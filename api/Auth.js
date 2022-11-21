//Import Statements
const router = require('express').Router()
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const otptool = require('otp-without-db')
const crypto = require('crypto')
const { check, validationResult } = require('express-validator')
const UserModel = require('../models/UserModel')
const sendmail = require('../functions/SendMail')
const authorize = require('../middlewares/authorize')

//Reading Environment Variables
const JWT_SECRET = process.env.JWT_SECRET
const OTP_SECRET = process.env.OTP_SECRET

//New Auth Route - Generate Auth Code
router.post(
    '/generateauthcode',

    [
        check('email', 'Invalid Email format').isEmail()
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            const { email } = req.body

            try {
                let user = await UserModel.findOne({ email })
                const otp = crypto.randomBytes(4).toString('hex')
                const hash = otptool.createNewOTP(email, otp, key = OTP_SECRET, expiresAfter = 5, algorithm = 'sha256')
                await sendmail(email, otp)
                if (user) {
                    return res.status(200).json({ hash, newuser: false, msg: 'Check auth code in email' })
                }

                else {
                    return res.status(200).json({ hash, newuser: true, msg: 'Check auth code in email' })
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//New Auth Route - Verify Auth Code
router.post(
    '/verifyauthcode',

    [
        check('email', 'Provide valid email').isEmail(),
        check('otp', 'Invalid OTP format').isLength(6),
        check('hash', 'Invalid Hash').notEmpty(),
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            const { email, otp, hash } = req.body

            try {
                const isOTPValid = otptool.verifyOTP(email, otp, hash, key = OTP_SECRET, algorithm = 'sha256')

                if (isOTPValid) {
                    let user = await UserModel.findOne({ email })

                    if (user) {
                        if (user.accessToken) {
                            const accessToken = user.accessToken
                            return res.status(200).json({ authenticated: true, accessToken })
                        }

                        else {
                            const payload = { id: user.id, iss: 'https://frostlake.vercel.app' }
                            const accessToken = jwt.sign(payload, JWT_SECRET)
                            user.accessToken = accessToken
                            await user.save()
                            return res.status(200).json({ authenticated: true, accessToken })
                        }
                    }

                    else {
                        const { name } = req.body || 'No Name'
                        user = new UserModel({ name, email })
                        const payload = { id: user.id, iss: 'https://frostlake.vercel.app' }
                        const accessToken = jwt.sign(payload, JWT_SECRET)
                        user.accessToken = accessToken
                        await user.save()
                        return res.status(200).json({ authenticated: true, accessToken })
                    }
                }

                else {
                    return res.status(400).json({ authenticated: false, msg: 'Invalid auth code' })
                }
            }

            catch (error) {
                return res.status(500).json({ authenticated: false, msg: 'Connection error' })
            }
        }
    }
)

//UseAuth Route
router.get(
    '/useauth',

    authorize,

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

//Signout Route
router.get(
    '/signout',

    authorize,

    async (req, res) => {
        try {
            const user = await UserModel.findById(req.id)
            user.accessToken = ''
            await user.save()
            return res.status(200).json({ msg: 'Sign Out Successful' })
        }

        catch (error) {
            return res.status(500).json({ msg: 'Connection Error' })
        }
    }
)

//Export Statement
module.exports = router