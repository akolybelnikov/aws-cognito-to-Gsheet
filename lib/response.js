function success(body) {
  return buildResponse(200, body)
}

function failure(body) {
  return buildResponse(500, body)
}

function buildResponse(statusCode, body) {
  const response = {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
    isBase64Encoded: false,
  }
  return response
}

module.exports = {
  success,
  failure,
}
