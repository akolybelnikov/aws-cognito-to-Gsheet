require('dotenv').config()
const SPREADSHEET_ID = process.env.SPREADSHEET_ID

/**
 * Prints the users data in the spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function getUsers(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  try {
    const {
      data: { values },
    } = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!F2:F',
    })
    return values

    // if (values && values.length && values.length < users.length) {
    //   let gsheetUserEmails = []
    //   values.map(email => gsheetUserEmails.push(email[0].toLowerCase()))
    //   const diff = users
    //     .filter(user => !gsheetUserEmails.includes(user.email.toLowerCase()))
    //     .map(userdata => Object.values(userdata))
    //   await addUsers(auth, diff)
    //   return diff.length
    // }
    // return []
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
  getUsers,
  addUsers,
}
