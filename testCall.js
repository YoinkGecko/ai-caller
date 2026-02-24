require('dotenv').config()
const { makeCall } = require('./services/callService')

async function test() {
  const sid = await makeCall('+919920621584')  // put your real number
  console.log("Call SID:", sid)
}

test().catch(console.error)