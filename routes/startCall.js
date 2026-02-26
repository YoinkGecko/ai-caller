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

    const results = []

    

   for (const lead of pendingLeads) {
  try {
    const [id, name, phone] = lead.row

    if (!phone) continue

    await updateRow(lead.rowIndex, [
      id, name, phone, 'calling', '', '', ''
    ])

    const callSid = await makeCall(phone)

    await updateRow(lead.rowIndex, [
      id, name, phone, 'calling', '', '', callSid
    ])

    results.push({ id, phone, callSid })

  } catch (err) {
    console.error("Call failed for row:", lead.rowIndex, err.message)
  }
}

    res.json({
      message: "Calls initiated",
      total: results.length,
      calls: results
    })

  } catch (err) {
    console.error("Start-call error:", err)
    res.status(500).json({ error: "Failed to process leads" })
  }
})

module.exports = router