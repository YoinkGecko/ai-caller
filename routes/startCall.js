const express = require('express')
const router = express.Router()

const { getAllPendingLeads, updateRow } = require('../services/sheetsService')
const { makeCall } = require('../services/callService')

router.post('/', async (req, res) => {
  try {
    const pendingLeads = await getAllPendingLeads()

    if (pendingLeads.length === 0) {
      return res.json({ message: "No pending leads found" })
    }

    const lead = pendingLeads[0]
    const [id, name, phone] = lead.row

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

    await updateRow(lead.rowIndex, [
      id,
      name,
      phone,
      'calling',
      '',
      '',
      callSid
    ])

    res.json({
      message: "First call initiated",
      callSid
    })

  } catch (err) {
    console.error("Start-call error:", err)
    res.status(500).json({ error: "Failed to start call" })
  }
})

module.exports = router