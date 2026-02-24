const express = require('express')
const router = express.Router()

const { getPendingLead, updateRow } = require('../services/sheetsService')
const { makeCall } = require('../services/callService')

router.post('/', async (req, res) => {
  try {
    const lead = await getPendingLead()

    if (!lead) {
      return res.json({ message: "No pending leads" })
    }

    const [id, name, phone] = lead.row

    // Update state to calling
    await updateRow(lead.rowIndex, [
      id,
      name,
      phone,
      'calling',
      '',
      '',
      ''
    ])

    const callSid = await makeCall(phone)

    // Save callSid
    await updateRow(lead.rowIndex, [
      id,
      name,
      phone,
      'calling',
      '',
      '',
      callSid
    ])

    res.json({ message: "Call initiated", callSid })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to start call" })
  }
})

module.exports = router