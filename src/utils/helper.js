const errorMessages = {
  404: 'Record not found for id: {{recordId}}',
}

const createError = (errorCode, recordId) => {
  const errorMessage = errorMessages[errorCode]

  const error = new Error(errorMessage.replace('{{recordId}}', recordId))
  error.statusCode = errorCode
  return error
}

const getPagination = (query = {}) => {
  const { page = 1, size = 100, sortBy = '', ascending = true } = query
  const offset = (page - 1) * size
  const isAscending = ascending === 'true' || ascending === true
  let sortConfig = {}
  if (sortBy) sortConfig = { [sortBy]: isAscending ? 1 : -1 }

  return { page, size, sortBy, sortConfig, offset, ascending: isAscending }
}

module.exports = { createError, getPagination }
