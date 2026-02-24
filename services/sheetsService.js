const { google } = require('googleapis')
require('dotenv').config()

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ]
})

const sheets = google.sheets({ version: 'v4', auth })

const SHEET_NAME = 'sheet1'

async function getAllRows() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A2:G`
  })

  return res.data.values || []
}

async function getPendingLead() {
  const rows = await getAllRows()

  for (let i = 0; i < rows.length; i++) {
    const callState = rows[i][3]
    if (!callState || callState === 'pending') {
      return {
        rowIndex: i + 2,
        row: rows[i]
      }
    }
  }

  return null
}

async function findRowByCallSid(callSid) {
  const rows = await getAllRows()

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][6] === callSid) {
      return {
        rowIndex: i + 2,
        row: rows[i]
      }
    }
  }

  return null
}

async function updateRow(rowIndex, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A${rowIndex}:G${rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values]
    }
  })
}

module.exports = {
  getPendingLead,
  findRowByCallSid,
  updateRow
}