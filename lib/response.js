function success(body) {
  return buildResponse(200, body)
}

function failure(body) {
  return buildResponse(500, body)
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  }
}

module.exports = {
  success,
  failure,
}
