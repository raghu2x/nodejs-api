import 'dotenv/config'
import app from './src/app'
import io from '@/config/socket-io'
import appConstants from '@/config/appConstants'

const { API_PORT, SOCKET_IO_PORT } = appConstants

// socket io
io.listen(SOCKET_IO_PORT)

app.listen(API_PORT, () => {
  console.log(`________________server is running at port ${API_PORT}`)
})
