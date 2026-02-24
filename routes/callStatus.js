const express = require('express')
const router = express.Router()
const axios = require('axios')

const { findRowByCallSid, updateRow } = require('../services/sheetsService')
const { classifyAndSummarize } = require('../services/aiService')

router.post('/', async (req, res) => {
  try {
    const { CallSid, CallStatus, RecordingUrl } = req.body

    const record = await findRowByCallSid(CallSid)

    if (!record) {
      return res.sendStatus(200)
    }

    const [id, name, phone, callState, aiStatus, summary, callSid] = record.row

    // Idempotency check
    if (callState === 'processed') {
      return res.sendStatus(200)
    }

    if (CallStatus === 'no-answer') {
      await updateRow(record.rowIndex, [
        id,
        name,
        phone,
        'processed',
        'No Answer',
        'Call was not answered.',
        callSid
      ])
      return res.sendStatus(200)
    }

    if (CallStatus !== 'completed') {
      return res.sendStatus(200)
    }

    let transcript = "No transcript available"

    if (RecordingUrl) {
      try {
        const t = await axios.get(`${RecordingUrl}.json`)
        transcript = t.data.transcription_text || transcript
      } catch (err) {
        console.error("Transcript fetch failed")
      }
    }

    const result = await classifyAndSummarize(transcript)

    await updateRow(record.rowIndex, [
      id,
      name,
      phone,
      'processed',
      result.status,
      result.summary,
      callSid
    ])

    res.sendStatus(200)

  } catch (err) {
    console.error(err)
    res.sendStatus(200)
  }
})

module.exports = router