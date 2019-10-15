const { getUsersEmails, addNewUsers } = require('../index')
const { fetchUsers } = require('../lib/cognito')
const { success, failure } = require('../lib/response')

export async function handler(event, context) {
  try {
    // const users = await fetchUsers()
    const emails = getUsersEmails()
          // fs.readFile(USERS_JSON, { encoding: 'utf8' }, (err, data) => {
      //   if (err) throw err
      // let Data = JSON.parse(data)
      // if (emails.length && emails.length < users.length) {
      //   let gsheetUserEmails = []
      //   emails.map(email => gsheetUserEmails.push(email[0].toLowerCase()))
      //   const diff = users
      //     .filter(user => !gsheetUserEmails.includes(user.email.toLowerCase()))
      //     .map(userdata => Object.values(userdata))
      //   const res = await addUsers(auth, diff)
      //   return { diff, res }
      // }
      // return String(null)
      // })
      console.log('from lambda: ', emails)
    return success({msg: 'success'})
  } catch (err) {
    return failure(JSON.stringify(err))
  }
}
