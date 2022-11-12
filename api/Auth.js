//Import Statements
const router = require('express').Router()
const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const otptool = require('otp-without-db')
const otpgen = require('otp-generator')
const { check, validationResult } = require('express-validator')
const UserModel = require('../models/UserModel')
const sendmail = require('../functions/SendMail')
const identity = require('../middlewares/identity')

//Reading Environment Variables
const JWT_SECRET = process.env.JWT_SECRET
const OTP_SECRET = process.env.OTP_SECRET

//Sign Up Route - Get OTP
router.post(
    '/signup/getotp',

    [
        check('name', 'Name is required').notEmpty(),
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

                if (user) {
                    return res.status(400).json({ msg: 'Account with same email id already exists' })
                }

                else {
                    const otp = otpgen.generate(6, { lowerCaseAlphabets: true, upperCaseAlphabets: true, digits: true, specialChars: false })
                    const hash = otptool.createNewOTP(email, otp, key = OTP_SECRET, expiresAfter = 5, algorithm = 'sha256')
                    await sendmail(email, otp)
                    return res.status(200).json({ hash, msg: 'Check OTP in email' })
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Sign Up Route - Register
router.post(
    '/signup/register',

    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Provide valid email').isEmail(),
        check('password', 'Password must be within 8 & 18 letters').isLength({ min: 8, max: 18 }),
        check('otp', 'Invalid OTP format').isLength(6),
        check('hash', 'Invalid Hash').notEmpty(),
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            let { name, email, password, otp, hash } = req.body
            password = await bcrypt.hash(password, 12)

            try {
                let user = await UserModel.findOne({ email })

                if (user) {
                    return res.status(400).json({ msg: 'Account with same email id already exists' })
                }

                else {
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key = OTP_SECRET, algorithm = 'sha256')

                    if (isOTPValid) {
                        user = new UserModel({ name, email, password })
                        await user.save()
                        const payload = { id: user.id, iss: 'https://frostlake.vercel.app' }

                        const accessToken = jwt.sign(payload, JWT_SECRET)
                        user.accessToken = accessToken
                        await user.save()
                        return res.status(200).json({ accessToken })
                    }

                    else {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Sign In Route - Get OTP
router.post(
    '/signin/getotp',

    [
        check('email', 'Provide valid email').isEmail(),
        check('password', 'Password is required').notEmpty(),
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            let { email, password } = req.body

            try {
                let user = await UserModel.findOne({ email })

                if (!user) {
                    return res.status(401).json({ msg: 'Invalid credentials' })
                }

                else {
                    const isPasswordMatching = await bcrypt.compare(password, user.password)

                    if (isPasswordMatching) {
                        const otp = otpgen.generate(6, { lowerCaseAlphabets: true, upperCaseAlphabets: true, digits: true, specialChars: false })
                        const hash = otptool.createNewOTP(email, otp, key = OTP_SECRET, expiresAfter = 3, algorithm = 'sha256')
                        await sendmail(email, otp)
                        return res.status(200).json({ hash, msg: 'Check OTP in email' })
                    }

                    else {
                        return res.status(401).json({ msg: 'Invalid credentials' })
                    }
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Sign In Route - Login
router.post(
    '/signin/login',

    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password must be within 8 & 18 letters').isLength({ min: 8, max: 18 }),
        check('otp', 'OTP must be a 6 digit number').isLength(6),
        check('hash', 'Invalid hash').notEmpty()
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            let { email, password, otp, hash } = req.body

            try {
                let user = await UserModel.findOne({ email })

                if (!user) {
                    return res.status(400).json({ msg: 'Account does not exist' })
                }

                else {
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key = OTP_SECRET, algorithm = 'sha256')
                    const isPasswordMatching = await bcrypt.compare(password, user.password)

                    if (isOTPValid && isPasswordMatching) {
                        const payload = { id: user.id, iss: 'https://frostlake.vercel.app' }
                        if (user.accessToken === '') {
                            const accessToken = jwt.sign(payload, JWT_SECRET)
                            user.accessToken = accessToken
                            await user.save()
                            return res.status(200).json({ accessToken })
                        }

                        else {
                            const accessToken = user.accessToken
                            return res.status(200).json({ accessToken })
                        }
                    }

                    else {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Password Reset Route - Get OTP
router.post(
    '/pwreset/getotp',

    [
        check('email', 'Email is required').notEmpty(),
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

                if (!user) {
                    return res.status(400).json({ msg: 'Account does not exist' })
                }

                else {
                    const otp = otpgen.generate(6, { lowerCaseAlphabets: true, upperCaseAlphabets: true, digits: true, specialChars: false })
                    const hash = otptool.createNewOTP(email, otp, key = OTP_SECRET, expiresAfter = 3, algorithm = 'sha256')
                    await sendmail(email, otp)
                    return res.status(200).json({ hash, msg: 'Check OTP in email' })
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Password Reset Route - Reset & Login
router.post(
    '/pwreset/reset',

    [
        check('email', 'Email is required').notEmpty(),
        check('password', 'Password must be within 8 & 18 letters').isLength({ min: 8, max: 18 }),
        check('otp', 'OTP must be a 6 digit number').isLength(6),
        check('hash', 'Invalid hash').notEmpty()
    ],

    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ msg: errors.array()[0].msg })
        }

        else {
            let { email, password, otp, hash } = req.body
            password = await bcrypt.hash(password, 12)

            try {
                let user = await UserModel.findOne({ email })

                if (!user) {
                    return res.status(400).json({ msg: 'Account does not exist' })
                }

                else {
                    const isOTPValid = otptool.verifyOTP(email, otp, hash, key = OTP_SECRET, algorithm = 'sha256')

                    if (isOTPValid) {
                        const filter = { email: email }
                        const update = { password: password }
                        await UserModel.findOneAndUpdate(filter, update)
                        const payload = { id: user.id, iss: 'https://frostlake.vercel.app' }
                        const accessToken = jwt.sign(payload, JWT_SECRET)
                        user.accessToken = accessToken
                        await user.save()
                        return res.status(200).json({ accessToken })
                    }

                    else {
                        return res.status(400).json({ msg: 'Invalid OTP' })
                    }
                }
            }

            catch (error) {
                return res.status(500).json({ msg: 'Connection error' })
            }
        }
    }
)

//Signout Route
router.get(
    '/signout',

    identity,

    async (req, res) => {
        try {
            const user = await UserModel.findById(req.id)
            user.accessToken = ''
            await user.save()
            return res.status(200).json({ msg: 'Logout Successful' })
        }

        catch (error) {
            return res.status(500).json({ msg: 'Connection Error' })
        }
    }
)

//Export Statement
module.exports = router