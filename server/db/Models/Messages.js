const Sequelize = require('Sequelize')
const sequelize = require('../sequelize.js')

class Messages extends Sequelize.Model {}

Messages.init(
  {
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
    createDate: {
      type: Sequelize.DATE,
    },
  },
  {sequelize, modelName: 'newMessages'},
)

// Messages.sync({force: true})
module.exports = Messages
