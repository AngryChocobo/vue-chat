export default {
  loggedInUser: state => state.loggedInUserModule.loggedInUser,
  loggedInUserId: (state, getters) => getters.loggedInUser.id,
  friendRequestUnReadCount: state =>
    state.socketModule.friendRequestList.filter(v => !v.read).length,
  totalUnReadMessage: state =>
    state.talkModule.talkList.filter(v => v.unReadCount),
  totalUnReadMessageCount: (state, getters) =>
    getters.totalUnReadMessage
      .map(v => v.unReadCount)
      .reduce((a, b) => a + b, 0),
}
