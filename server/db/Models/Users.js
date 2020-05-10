const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const Users = sequelize.define('users', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nickname: {
    type: Sequelize.STRING,
  },
  src: {
    type: Sequelize.STRING,
  },
})

// Users.sync({force: true})

module.exports = Users
