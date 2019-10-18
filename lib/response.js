function success(body) {
  return buildResponse(200, body)
}

function failure(body) {
  return buildResponse(500, body)
}

function buildResponse(statusCode, body) {
  console.log(body)
  console.log(JSON.stringify(body))
  return {
    "statusCode": statusCode,
    "headers": {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    "body": JSON.stringify(body),
    "isBase64Encoded": false
  }
}

module.exports = {
  success,
  failure,
}
