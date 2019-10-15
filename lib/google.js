require('dotenv').config()

const { promisify } = require('util')
const { google } = require('googleapis')
const { authorize } = require('./authenticate')

const SPREADSHEET_ID = process.env.SPREADSHEET_ID


/**
 * Prints the users data in the spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getUserEmails () {
  const auth = await authorize()
  try {
    const sheets = google.sheets({ version: 'v4', auth })
    const { data: { values } } = await sheets.spreadsheets.values.get(
      {
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!F2:F',
      })
    return values
  } catch (err) {
    return console.error('The API returned an error: ' + err)
  }
  // const auth = await authorize()
  // const sheets = google.sheets({ version: 'v4', auth })
  // sheets.spreadsheets.values.get(
  //   {
  //     spreadsheetId: SPREADSHEET_ID,
  //     range: 'Users!F2:F',
  //   },
  //   async (err, res) => {
  //     if (err) return console.error('The API returned an error: ' + err)
  //     const emails = res.data.values
  //     console.table(emails)
  //     // fs.readFile(USERS_JSON, { encoding: 'utf8' }, (err, data) => {
  //     //   if (err) throw err
  //     // let Data = JSON.parse(data)
  //     // if (emails.length && emails.length < users.length) {
  //     //   let gsheetUserEmails = []
  //     //   emails.map(email => gsheetUserEmails.push(email[0].toLowerCase()))
  //     //   const diff = users
  //     //     .filter(user => !gsheetUserEmails.includes(user.email.toLowerCase()))
  //     //     .map(userdata => Object.values(userdata))
  //     //   const res = await addUsers(auth, diff)
  //     //   return { diff, res }
  //     // }
  //     // return String(null)
  //     // })
  //   },
  // )
}

async function addUsers (auth, newUsers) {
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

async function init () {
  const emails = await getUserEmails()
  console.table(emails)
}

init()

module.exports = {
  getUserEmails,
}
