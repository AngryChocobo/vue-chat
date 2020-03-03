import Vue from 'vue'
import io from 'socket.io-client'
const socket = io.connect('http://localhost:8888')

socket.emit('login', 1 || window.loggerInUser.id)

socket.on('receiveMessage', data => {
  console.log('收到了新消息', JSON.stringify(data))
})
Vue.prototype.$socket = socket
