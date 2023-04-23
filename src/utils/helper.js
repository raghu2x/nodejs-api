const errorMessages = {
  404: 'Record not found for id: {{param}}',
  emailNotExist: 'User not found with email {{param}}',
  notVerified: 'Account is not verified',
  InvalidCred: 'Invalid email or password. Please try again.',
  accountNotExist: 'Account not Exist',
  alreadyVerified: 'Account already verified',
  invalidOtp: 'Invalid OTP',
  resetTokenExpired: 'reset password link expired.',
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

const getQuery = (q = '') => {
  const [field, queryType, searchTerm] = q.split(' ')

  const regex = new RegExp(searchTerm, 'i')
  switch (queryType) {
    case 'like':
      return { [field]: { $regex: regex } }
    case 'eq':
      return { [field]: searchTerm }
    case 'ne':
      return { [field]: { $ne: searchTerm } }
    case 'gt':
      return { [field]: { $gt: searchTerm } }
    case 'gte':
      return { [field]: { $gte: searchTerm } }
    case 'lt':
      return { [field]: { $lt: searchTerm } }
    case 'lte':
      return { [field]: { $lte: searchTerm } }
    default:
      return {}
  }
}

const queryBuilder = (query = []) => {
  const q = query.map(element => {
    const [field, queryType, searchTerm] = element.split(' ')
    if (queryType === 'gt' || queryType === 'gte' || queryType === 'lt' || queryType === 'lte') {
      const existingQuery = getQuery(`${field} ${queryType} ${searchTerm}`)
      return { $and: [{ [field]: { $exists: true } }, existingQuery] }
    }
    return getQuery(element)
  })
  if (q.length === 0) return {}
  return { $or: q }
}

module.exports = { createError, getPagination, queryBuilder }
