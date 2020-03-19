const app = require('./express.js')
const http = require('http').createServer(app)
require('./socket.io.js')(http)

http.listen(3000, function() {
  console.log('server is running at 3000')
})
