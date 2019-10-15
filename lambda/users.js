const { processUsers } = require('../index')
const { fetchUsers } = require('../lib/cognito')
const { success, failure } = require('../lib/response')

export async function handler(event, context) {
  try {
    const users = await fetchUsers()
    processUsers(users)
    return success({ msg: 'success' })
  } catch (err) {
    return failure(JSON.stringify(err))
  }
}
