require('dotenv').config()
require('./config')

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

// Routes
app.use('/start-call', require('./routes/startCall'))
app.use('/call-status', require('./routes/callStatus'))
app.use('/twiml', require('./routes/twiml'))

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString()
  })
})

// Status endpoint
app.get('/status', async (req, res) => {
  const { getAllPendingLeads } = require('./services/sheetsService')
  const pending = await getAllPendingLeads()
  res.json({ pendingCount: pending.length })
})

// Root route serves frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})