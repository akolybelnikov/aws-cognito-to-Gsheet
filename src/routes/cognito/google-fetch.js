import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const API_KEY = process.env.API_KEY

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
})

export async function get(req, res, next) {
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', client })
  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
    key: API_KEY,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!F2:F',
  })
  let emails = values
    .reduce((acc, curr) => [...acc, ...curr], [])
    .map(email => email.toLowerCase())

  if (emails) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify(emails))
  } else {
    next()
  }
}
