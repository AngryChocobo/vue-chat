const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

const Messages = sequelize.define('newMessages', {
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
  },
})

// Messages.sync({force: true})
module.exports = Messages
