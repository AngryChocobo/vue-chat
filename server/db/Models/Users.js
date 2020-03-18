const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

class Users extends Sequelize.Model {}

Users.init(
  {
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
    createDate: {
      type: Sequelize.DATE,
    },
  },
  {sequelize, modelName: 'newusers'},
)

// User.sync({force: true})
module.exports = Users
