interface ErrorMessages {
  404: string
  emailNotExist: string
  notVerified: string
  InvalidCred: string
  accountNotExist: string
  alreadyVerified: string
  invalidOtp: string
  resetTokenExpired: string
}

const errorMessages: ErrorMessages = {
  404: 'Record not found for id: {{param}}',
  emailNotExist: 'User not found with email {{param}}',
  notVerified: 'Account is not verified',
  InvalidCred: 'Invalid email or password. Please try again.',
  accountNotExist: 'Account not Exist',
  alreadyVerified: 'Account already verified',
  invalidOtp: 'Invalid OTP',
  resetTokenExpired: 'reset password link expired.'
}

type ErrorMessageKey = keyof ErrorMessages

const createError = (msgKey: ErrorMessageKey, param: string, statusCode: number = 400): Error => {
  const errorMessage = errorMessages[msgKey]
  const error = new Error(errorMessage.replace('{{param}}', param))
  // error.statusCode = statusCode // You can add a custom property to Error type if needed.
  return error
}

interface PaginationQuery {
  page?: number
  size?: number
  sortBy?: string
  ascending?: boolean | string
}

interface PaginationConfig {
  page: number
  size: number
  sortBy: string
  sortConfig: Record<string, 1 | -1>
  offset: number
  ascending: boolean
}

const getPagination = (query: PaginationQuery = {}): PaginationConfig => {
  const { page = 1, size = 100, sortBy = '', ascending = true } = query
  const offset = (page - 1) * size
  const isAscending = ascending === 'true' || ascending === true
  const sortConfig: Record<string, 1 | -1> = {}
  if (sortBy !== undefined && sortBy !== '') sortConfig[sortBy] = isAscending ? 1 : -1

  return { page, size, sortBy, sortConfig, offset, ascending: isAscending }
}

// type QueryType = 'like' | 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte'

type QueryObject = Record<string, any>

const getQuery = (q: string = ''): QueryObject => {
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

const queryBuilder = (query: string[] = []): QueryObject => {
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

export { createError, getPagination, queryBuilder }
