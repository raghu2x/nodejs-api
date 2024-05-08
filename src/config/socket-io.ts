import { Server, type Socket } from 'socket.io'

const io = new Server({})

io.on('connection', (socket: Socket) => {
  console.log('A user connected')

  // Handle custom events or messages here

  socket.on('disconnect', () => {
    console.log('User disconnected')
  })
})

setInterval(() => {
  io.emit('new_order/restaurant_id/1', { name: 'Raghvendra Yadav', age: 21 })
}, 2000)

export default io
