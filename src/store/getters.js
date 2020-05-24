export default {
  loggedInUser: state => state.loggedInUserModule.loggedInUser,
  loggedInUserId: (state, getters) => getters.loggedInUser.id,
}
