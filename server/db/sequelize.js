const Sequelize = require('sequelize')
const mysqlConfig = require('./mysqlConfig.js')

const sequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.user,
  mysqlConfig.password,
  {
    host: mysqlConfig.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 3000,
    },
    define: {
      // timestamps: false,
      freezeTableName: true, // 阻止自动改为复数形式
    },
  },
)

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })

module.exports = sequelize
