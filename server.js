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
  const { getAllRows } = require('./services/sheetsService')

  const rows = await getAllRows()

  let pending = 0
  let calling = 0
  let processed = 0
  let failed = 0

  rows.forEach(r => {
    const state = r[3]
    if (state === 'pending' || !state) pending++
    else if (state === 'calling') calling++
    else if (state === 'processed') processed++
    else if (state === 'failed') failed++
  })

  res.json({
    total: rows.length,
    pending,
    calling,
    processed,
    failed
  })
})

// Root route serves frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})