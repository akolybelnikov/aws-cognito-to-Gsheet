require('dotenv').config()

const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')
// const { importJSON } = require('./transformUsers')

const TOKEN_PATH = 'token.json'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const USERS_JSON = 'assets/sanitizedUsers.json'

const SPREADSHEET_ID = process.env.SPREADSHEET_ID

function processUsers() {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err)
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), addNewUsers)
  })
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0],
  )

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', code => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error('Error while trying to retrieve access token', err)
      oAuth2Client.setCredentials(token)
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

/**
 * Prints the users data in the spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function addNewUsers(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!F2:F',
    },
    (err, res) => {
      if (err) return console.error('The API returned an error: ' + err)
      const emails = res.data.values
      if (emails.length) {
        fs.readFile(USERS_JSON, { encoding: 'utf8' }, (err, data) => {
          if (err) throw err
          let Data = JSON.parse(data)
          if (emails.length < Data.length) {
            let gsheetUserEmails = []
            emails.map(email => gsheetUserEmails.push(email[0].toLowerCase()))
            const diff = Data.filter(
              user => !gsheetUserEmails.includes(user.email.toLowerCase()),
            ).map(userdata => Object.values(userdata))
            addUsers(auth, diff)
          }
        })
      } else {
        console.log('No data found.')
      }
    },
  )
}

function addUsers(auth, newUsers) {
  const sheets = google.sheets({ version: 'v4', auth })
  sheets.spreadsheets.values
    .append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A2:F',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: newUsers,
      },
    })
    .then(res => console.info(res.status, res.statusText))
    .catch(err => console.error(err))
}

module.exports = {
  processUsers,
}
