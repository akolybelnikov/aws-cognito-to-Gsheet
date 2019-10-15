const fs = require('fs')

const createCsvWriter = require('csv-writer').createObjectCsvWriter

const USERS_JSON = 'users.json'
const CSV_PATH = 'users.csv'

function mapUsers(rawUsers) {
  return rawUsers.map(user => ({
    ...{
      created: user.UserCreateDate,
    },
    ...mergeAttributes(user.Attributes),
  }))
}

function writeFileAsync(data) {
  const jsonData = JSON.stringify(data)
  fs.writeFile(USERS_JSON, jsonData, error => {
    if (error) console.error('Failed to write:', error)
    console.log('Successfully wrote to json file')
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
    .catch(err => console.error(JSON.stringify(err)))
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

module.exports = {
  mapUsers,
  writeToCSV,
  writeFileAsync,
}
