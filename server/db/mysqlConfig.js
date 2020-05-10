const processPassword = process.env.PWD
module.exports = {
  host: 'localhost',
  user: 'root',
  password: processPassword || '123456',
  database: 'chat',
}
