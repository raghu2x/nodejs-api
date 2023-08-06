interface DbConfig {
  readonly useNewUrlParser: boolean
  readonly useUnifiedTopology: boolean
}

export const DB_CONFIG: DbConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
