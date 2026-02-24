const twilio = require('twilio')

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

async function makeCall(phone) {
  const call = await client.calls.create({
    url: `${process.env.BASE_URL}/twiml`,
    to: phone,
    from: process.env.TWILIO_PHONE,
    statusCallback: `${process.env.BASE_URL}/call-status`,
    statusCallbackEvent: ['completed'],
    record: true
  })

  return call.sid
}

module.exports = { makeCall }