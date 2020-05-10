const Sequelize = require('sequelize')
const sequelize = require('../sequelize.js')

// class Friends extends Sequelize.Model {}
// // sequelize.sync({force: true})
// Friends.init(
//   {
//     // userId: {
//     //   type: Sequelize.INTEGER,
//     //   allowNull: false,
//     // },
//     // friendId: {
//     //   type: Sequelize.INTEGER,
//     //   allowNull: false,
//     // },
//     friendRemark: {
//       type: Sequelize.STRING,
//     },
//   },
//   {sequelize, modelName: 'newFriends'},
// )

const Friends = sequelize.define('friends', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  friendId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  friendRemark: {
    type: Sequelize.STRING,
  },
})

// Friends.sync({force: true})
module.exports = Friends
