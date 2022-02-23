function createResponse(actionSuccess, statusCode = 200, message = '', data = {}) {
  return {
    actionSuccess, // boolean
    statusCode,    // HTTP code
    message,       // string
    data           // object
  };
}


module.exports = { createResponse };