require('dotenv').config()

const service = require('./services/sheetsService')
console.log("SERVICE EXPORT:", service)

async function test() {
  if (service.getPendingLead) {
    const lead = await service.getPendingLead()
    console.log(lead)
  } else {
    console.log("getPendingLead not found in export")
  }
}

test().catch(console.error)