//Import Statements
const express = require('express')
const Connection = require('./functions/Connection')
const dotenv = require('dotenv').config()
const cors = require('cors')
const fs = require('fs')

//Initialize Express handler
const handler = express()
handler.listen(process.env.PORT || 7000)

handler.use(express.json({ extended: false, limit: '2mb' }))
handler.use(cors())

//MongoDB Connection
Connection()

//API Routes
fs.readdirSync('./api').map(route => {
    handler.use(`/api/${route.split('.')[0].toLowerCase()}`, require(`./api/${route.split('.')[0]}`))
})
handler.use('/hooks/useidentity', require('./hooks/UseIdentity'))

if (process.env.NODE_ENV == 'production') {
    const root = require('path').join(__dirname, 'view', 'build')
    handler.use(express.static(root));
    handler.get('*', (req, res) => {
        res.sendFile('index.html', { root });
    })
}