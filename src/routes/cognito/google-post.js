import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const API_KEY = process.env.API_KEY

const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
})

export async function post(req, res, next) {
  console.log(req.body)
  const client = await auth.getClient()
  const sheets = google.sheets({ version: 'v4', auth: client })
  const gsheet_res = await sheets.spreadsheets.values.append({
    key: API_KEY,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Users!A2:F',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: req.body,
    },
  })

  res.writeHead(200, {
    'Content-Type': 'application/json',
  })
  res.end(JSON.stringify(gsheet_res))

}
