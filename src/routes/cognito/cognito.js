require('dotenv').config()
const AWS = require('aws-sdk')

export async function get(req, res, next) {
  AWS.config.update({
    region: process.env.ENV_DEFAULT_REGION,
    accessKeyId: process.env.ENV_ACCESS_KEY_ID,
    secretAccessKey: process.env.ENV_SECRET_ACCESS_KEY,
  })
  const cognito = new AWS.CognitoIdentityServiceProvider()

  const mapUsers = rawUsers => {
    return rawUsers.map(user => ({
      ...{
        created: user.UserCreateDate,
      },
      ...mergeAttributes(user.Attributes),
    }))
  }

  const mergeAttributes = arr => {
    return arr.reduce((acc, curr) => {
      let attr = {}
      if (curr.Name !== 'phone_number_verified') {
        attr[curr.Name] = curr.Value
      }
      return { ...acc, ...attr }
    }, {})
  }

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
  if (users.length) {
    users.sort((a, b) => (a.created > b.created ? 1 : -1))
    res.writeHead(200, {
      'Content-Type': 'application/json',
    })
    res.end(JSON.stringify(users))
  } else {
    next()
  }
}
