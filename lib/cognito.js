require('dotenv').config()

const AWS = require('aws-sdk')
const { mapUsers, writeFileAsync, writeToCSV } = require('./map-users')

async function fetchUsers() {
  AWS.config.update({
    region: process.env.ENV_DEFAULT_REGION,
    accessKeyId: process.env.ENV_ACCESS_KEY_ID,
    secretAccessKey: process.env.ENV_SECRET_ACCESS_KEY,
  })
  const cognito = new AWS.CognitoIdentityServiceProvider()

  try {
    let users = []
    let more = true
    let nextToken = ''

    while (more) {
      let params = {
        UserPoolId: process.env.ENV_USER_POOL_ID,
        Limit: 50,
      }
      if (nextToken !== '') {
        params.PaginationToken = nextToken
      }
      const usersData = await cognito.listUsers(params).promise()
      const mappedUsers = mapUsers(usersData.Users)

      if ('PaginationToken' in usersData) {
        nextToken = usersData.PaginationToken
      } else {
        more = false
      }
      users = [...users, ...mappedUsers]
    }
    users.sort((a, b) => (a.created > b.created ? 1 : -1))
    // writeToCSV(users)
    // writeFileAsync(users)

    return users
  } catch (err) {
    return console.error(JSON.stringify(err))
  }
}

module.exports = {
  fetchUsers,
}
