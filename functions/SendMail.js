//Import Statements
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv').config()

//Reading Environment Variables
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectUri = process.env.REDIRECT_URI
const refreshToken = process.env.REFRESH_TOKEN
const user = process.env.MAILER_UN

//OAuth2 Setup
const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
oAuth2Client.setCredentials({ refresh_token: refreshToken })

//Sendmail function
async function sendmail(email, otp) {
    try {
        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { type: 'OAuth2', user, clientId, clientSecret, refreshToken, accessToken }
        })
        let subject = 'Frostlake 2FA'
        let content = `${otp} is your verification code for Frostlake. Do not share the code with anyone.`
        await transporter.sendMail({ from: user, to: email, subject: subject, html: content })
    }

    catch (error) {
        throw error
    }
}

//Export Statement
module.exports = sendmail