const processPassword = process.env.password
module.exports = {
  host: 'localhost',
  user: 'root',
  password: processPassword || '123456',
  database: 'chat',
}
