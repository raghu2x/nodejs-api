import app from './src/app'

const { API_PORT, PORT } = process.env

app.listen(PORT ?? API_PORT, () => {
  console.log(`________________server is running at port ${API_PORT ?? ''}`)
})

module.exports = app
