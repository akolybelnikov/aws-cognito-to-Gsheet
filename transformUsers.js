const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const moment = require('moment')
// moment.locale('ru')

const USERS_JSON = 'assets/sanitizedUsers.json'
const COGNITO_USERS = 'assets/users.json'
const CSV_PATH = 'assets/users.csv'

function importJSON(filepath, encoding = 'utf8') {
  fs.readFile(filepath, { encoding }, (err, data) => {
    if (err) throw err
    let Data = JSON.parse(data).Users.sort((a, b) =>
      a.UserCreateDate > b.UserCreateDate ? 1 : -1,
    )
    let users = Data.map(user => ({
      ...{
        created: moment(user.UserCreateDate * 1000).format(
          'YYYY/MM/DD HH:mm:SS',
        ),
      },
      ...mergeAttributes(user.Attributes),
    }))
    writeToCSV(users)
    writeFileAsync(users)
  })
}

function writeFileAsync(data) {
  const strigifiedData = JSON.stringify(data)
  fs.writeFile(USERS_JSON, strigifiedData, error => {
    if (error) console.error('Failed to write:', error)
    console.log('success')
  })
}

function writeToCSV(users) {
  const csvWriter = createCsvWriter({
    path: CSV_PATH,
    header: Object.keys(users[0]).reduce((headers, prop) => {
      let header = {}
      header['id'] = prop
      header['title'] = prop
      headers.push(header)
      return headers
    }, []),
  })
  csvWriter
    .writeRecords(users)
    .then(() => console.log('The CSV file was written successfully'))
}

function mergeAttributes(arr) {
  return arr.reduce((acc, curr) => {
    let attr = {}
    if (curr.Name !== 'phone_number_verified') {
      attr[curr.Name] = curr.Value
    }
    return { ...acc, ...attr }
  }, {})
}

importJSON(COGNITO_USERS)

module.exports = {
  importJSON,
}
