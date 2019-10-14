const { processUsers } = require('../index')
const { success, failure } = require('../lib/response')

export async function handler(event, context, callback) {
  try {
    processUsers()
    callback(null, success({ msg: 'success' }))
  } catch (err) {
    callback(null, failure(err))
  }
}
