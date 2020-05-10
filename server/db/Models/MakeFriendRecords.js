const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

const MakeFriendRecords = sequelize.define('makeFriendRecords', {
  fromUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  targetUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  say: {
    type: Sequelize.STRING,
  },
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
  },
  stats: {
    type: Sequelize.ENUM('Waiting', 'Agree', 'Disagree'),
    defaultValue: 'Waiting',
  },
})

// MakeFriendRecords.sync({force: true})
module.exports = MakeFriendRecords
