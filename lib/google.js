require("dotenv").config();
const { google } = require("googleapis");

const {
  SPREADSHEET_ID,
  API_KEY,
  CLIENT_EMAIL,
  PRIVATE_KEY,
  PRIVATE_KEY_ID,
  PROJECT_ID
} = process.env;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
    keyId: PRIVATE_KEY_ID,
  },
  projectId: PROJECT_ID,
  scopes: "https://www.googleapis.com/auth/spreadsheets"
});

async function getUsers() {
  console.log(process.env)
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", client });
    const {
      data: { values }
    } = await sheets.spreadsheets.values.get({
      key: API_KEY,
      spreadsheetId: SPREADSHEET_ID,
      range: "Users!F2:F"
    });
    let emails = values
      .reduce((acc, curr) => [...acc, ...curr], [])
      .map(email => email.toLowerCase());

    return emails;
  } catch (err) {
    console.error("Google sheets API GET: ", err);
    return err;
  }
}

async function addUsers(newUsers) {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });
    return await sheets.spreadsheets.values.append({
      key: API_KEY,
      spreadsheetId: SPREADSHEET_ID,
      range: "Users!A2:F",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: newUsers
      }
    });
  } catch (err) {
    console.error("Google sheets API POST: ", err);
    return err;
  }
}

module.exports = {
  getUsers,
  addUsers
};
