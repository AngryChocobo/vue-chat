const io = require('socket.io-client')
const socket = io.connect('http://localhost:8888')

socket.emit('connectSocketIO', 2)
socket.emit('sendMessage', {
  fromUserId: 2,
  toUserId: 1,
  message: '我去吃饭了' + Date.now(),
})
