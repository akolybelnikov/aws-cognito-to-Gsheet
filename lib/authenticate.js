require('dotenv').config()

const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const readline = require('readline')
const { google } = require('googleapis')

const TOKEN_PATH = 'token.json'
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const CREDENTIALS = {
  client_id: process.env.CLIENT_ID,
  project_id: process.env.PROJECT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_secret: process.env.CLIENT_SECRET,
  redirect_uris: ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost'],
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
async function authorize () {
  try {
    const { client_secret, client_id, redirect_uris } = CREDENTIALS
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0],
    )
    try {
      // Check if we have previously stored a token.
      const token = await readFile(TOKEN_PATH, { encoding: 'utf8' })
      oAuth2Client.setCredentials(JSON.parse(token))

      return oAuth2Client
    } catch (err) {
      console.error('Error while retrieving a token: ', JSON.stringify(err))
      const token = await getNewToken(oAuth2Client)
      oAuth2Client.setCredentials(token)

      return oAuth2Client
    }
  } catch (err) {
    return console.error(JSON.stringify(err))

  }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
async function getNewToken (oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', async code => {
    try {
      rl.close()
      // Fetch and store the token to disk for later program executions
      const token = await oAuth2Client.getToken(code)
      await writeFile(TOKEN_PATH, JSON.stringify(token))
      console.log('Token stored to', TOKEN_PATH)
      return token
    } catch (err) {
      return console.error('Error while trying to retrieve access token', err)
    }
  })
}

module.exports = {
  authorize
}
