import {RootState} from '@/store/store'
export interface Getters {
  loggedInUser: any
  loggedInUserId: any
}

export default {
  loggedInUser: (state: RootState) => state.loggedInUserModule.loggedInUser,
  loggedInUserId: (state: RootState, getters) => getters.loggedInUser.id,
  token: (state: RootState) => state.loggedInUserModule.token,
  friendRequestUnReadCount: state =>
    state.socketModule.friendRequestList.filter(v => !v.read).length,
  totalUnReadMessage: state =>
    state.talkModule.talkList.filter(v => v.unReadCount),
  totalUnReadMessageCount: (state, getters) =>
    getters.totalUnReadMessage
      .map(v => v.unReadCount)
      .reduce((a, b) => a + b, 0),
}
