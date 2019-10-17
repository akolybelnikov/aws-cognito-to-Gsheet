const { getUsers, addUsers } = require('../lib/google')
const { fetchUsers } = require('../lib/cognito')
const { success, failure } = require('../lib/response')

export async function handler(event, context) {
  try {
    const users = await fetchUsers()
    console.log(users)
    const emails = await getUsers()
    console.log(emails)
    if (users.length && emails.length && emails.length < users.length) {
      let diff = users.filter(
        user => !emails.includes(user.email.toLowerCase()),
      )
      let data = diff.map(userdata => Object.values(userdata))
      await addUsers(data)

      return success(diff)
    }
    return success([])
  } catch (err) {
    return failure(err)
  }
}
