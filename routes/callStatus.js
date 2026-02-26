const express = require('express')
const router = express.Router()

const {
  findRowByCallSid,
  getAllPendingLeads,
  updateRow
} = require('../services/sheetsService')

const { makeCall } = require('../services/callService')
const { classifyAndSummarize } = require('../services/aiService')

router.post('/', async (req, res) => {
  console.log("🔥 Webhook hit", req.body);
  try {
    const { CallSid, CallStatus } = req.body

    console.log("Webhook:", CallSid, CallStatus)

    // 🔥 ONLY process when call is completed
    if (CallStatus !== 'completed' && CallStatus !== 'no-answer') {
  return res.sendStatus(200)
}

    const record = await findRowByCallSid(CallSid)
    if (!record) return res.sendStatus(200)

    const [id, name, phone, , , , callSid] = record.row

    let result = {
      status: 'Answered',
      summary: 'Call completed.'
    }

    if (CallStatus === 'no-answer') {
  result = {
    status: 'No Answer',
    summary: 'Call was not answered.'
  }
}

    await updateRow(record.rowIndex, [
      id,
      name,
      phone,
      'processed',
      result.status,
      result.summary,
      callSid
    ])

    // 🔥 Trigger next lead sequentially
    const pendingLeads = await getAllPendingLeads()

    if (pendingLeads.length > 0) {
      const next = pendingLeads[0]
      const [nid, nname, nphone] = next.row

      await updateRow(next.rowIndex, [
        nid,
        nname,
        nphone,
        'calling',
        '',
        '',
        ''
      ])

try {
  const newCallSid = await makeCall(nphone)

  await updateRow(next.rowIndex, [
    nid,
    nname,
    nphone,
    'calling',
    '',
    '',
    newCallSid
  ])
} catch (err) {
  console.error("Next call failed:", err.message)

  await updateRow(next.rowIndex, [
    nid,
    nname,
    nphone,
    'failed',
    'Failed',
    err.message,
    ''
  ])

  // 🔥 After failure, try next pending lead
  const remaining = await getAllPendingLeads()
  if (remaining.length > 0) {
    const nextAttempt = remaining[0]
    const [rid, rname, rphone] = nextAttempt.row

    await updateRow(nextAttempt.rowIndex, [
      rid,
      rname,
      rphone,
      'calling',
      '',
      '',
      ''
    ])

    const retrySid = await makeCall(rphone)

    await updateRow(nextAttempt.rowIndex, [
      rid,
      rname,
      rphone,
      'calling',
      '',
      '',
      retrySid
    ])
  }
}
    }

    res.sendStatus(200)

  } catch (err) {
    console.error("Webhook error:", err)
    res.sendStatus(200)
  }
})

module.exports = router