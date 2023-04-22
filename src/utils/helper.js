const errorMessages = {
  404: 'Record not found for id: {{param}}',
  emailNotExist: 'User not found with email {{param}}',
  notVerified: 'Account is not verified',
  InvalidCred: 'Invalid email or password. Please try again.',
  accountNotExist: 'Account not Exist',
  alreadyVerified: 'Account already verified',
}

const createError = (msgKey, param, statusCode = 400) => {
  const errorMessage = errorMessages[msgKey]

  const error = new Error(errorMessage.replace('{{param}}', param))
  error.statusCode = statusCode
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
