require('dotenv').config()

const fs = require('fs')
const readline = require('readline')
const { google } = require('googleapis')

const TOKEN_PATH = 'token.json'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
// const USERS_JSON = 'data/users.json'

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const CREDENTIALS = {
  installed: {
    client_id: process.env.CLIENT_ID,
    project_id: process.env.PROJECT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'],
  },
}

function processUsers(cognitoUsers) {
  return authorize(CREDENTIALS, addNewUsers, cognitoUsers)
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, cognitoUsers) {
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
    return callback(oAuth2Client, cognitoUsers)
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
async function addNewUsers(auth, users) {
  const sheets = google.sheets({ version: 'v4', auth })
  try {
    const {
      data: { values },
    } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!F2:F',
    })

    if (values && values.length && values.length < users.length) {
      let gsheetUserEmails = []
      values.map(email => gsheetUserEmails.push(email[0].toLowerCase()))
      const diff = users
        .filter(user => !gsheetUserEmails.includes(user.email.toLowerCase()))
        .map(userdata => Object.values(userdata))
      await addUsers(auth, diff)
      return diff.length
    }
    return []
  } catch (err) {
    if (err) return console.error('The API returned an error: ' + err)
  }
}

async function addUsers(auth, newUsers) {
  try {
    return await google
      .sheets({ version: 'v4', auth })
      .spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!A2:F',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: newUsers,
        },
      })
  } catch (err) {
    return console.error(JSON.stringify(err))
  }
}

module.exports = {
  processUsers,
}
