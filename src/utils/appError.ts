class AppError extends Error {
  public statusCode: number
  public status: string

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.message = message
  }
}

export default AppError
