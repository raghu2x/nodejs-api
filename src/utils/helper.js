const errorMessages = {
  404: 'Record not found for id: {{recordId}}',
}

const createError = (errorCode, recordId) => {
  const errorMessage = errorMessages[errorCode]

  const error = new Error(errorMessage.replace('{{recordId}}', recordId))
  error.statusCode = errorCode
  return error
}

module.exports = { createError }
