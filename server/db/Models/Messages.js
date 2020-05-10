const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const Messages = sequelize.define('messages', {
  fromUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  targetUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
  },
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
})

// Messages.sync({force: true})
module.exports = Messages
