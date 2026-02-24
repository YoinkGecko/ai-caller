const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  res.type('text/xml')
  res.send(`
    <Response>
      <Say>Hello, this is an AI assistant calling about our services.</Say>
      <Pause length="1"/>
      <Say>Are you interested in learning more?</Say>
      <Record transcribe="true" />
    </Response>
  `)
})

module.exports = router