require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const startCall = require('./routes/startCall')
const twiml = require('./routes/twiml')
const callStatus = require('./routes/callStatus')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/start-call', startCall)
app.use('/twiml', twiml)
app.use('/call-status', callStatus)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})