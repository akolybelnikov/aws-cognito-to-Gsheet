const { processUsers } = require('../index')
const { fetchUsers } = require('../lib/fetch-cognito-users')
const { success, failure } = require('../lib/response')

export async function handler(event, context) {
  try {
    const users = await fetchUsers()
    const result = processUsers(users)
    console.log(result)
    return success(users)
  } catch (err) {
    return failure(JSON.stringify(err))
  }
}
