import { type Document, type Query } from 'mongoose'

class APIFeatures<T extends Document> {
  query: Query<T[], T>
  queryString: any
  pagination: any = {}

  constructor(query: Query<T[], T>, queryString: any) {
    this.query = query
    this.queryString = queryString
  }

  sort(): APIFeatures<T> {
    const { sortBy, ascending } = this.queryString
    const isAscending = ascending === 'true' || ascending === true

    if (sortBy !== undefined && sortBy !== '') {
      this.query = this.query.sort({ [sortBy]: isAscending ? 1 : -1 })
    }

    this.pagination.sortBy = sortBy
    this.pagination.ascending = isAscending
    return this
  }

  paginate(): APIFeatures<T> {
    const page = this.queryString.page * 1 ?? 1
    const limit = this.queryString.limit * 1 ?? 10
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)

    this.pagination.page = page
    this.pagination.limit = limit
    return this
  }

  // Field Limiting ex: -----/user?fields=name,email,address
  // limitFields() {
  //   if (this.queryString.fields) {
  //     const fields = this.queryString.fields.split(',').join(' ')
  //     this.query = this.query.select(fields)
  //   }
  //   return this
  // }
}

export default APIFeatures
