const apiPath = 'http://localhost:3000'
export const SOCKETIO_PATH = 'http://localhost:3000'

export const getMessageList = (fromUserId, toUserId) =>
  `${apiPath}/getMessageList?fromUserId=${fromUserId}&toUserId=${toUserId}`

// export const sendNewMessage = `${apiPath}/sendNewMessage`
export const getUserFriendList = userId =>
  `${apiPath}/getUserFriendList?userId=${userId}`

export const getTalkTargetInfo = userId =>
  `${apiPath}/getTalkTargetInfo?userId=${userId}`

export const searchUsers = (fromUserId, keyword) =>
  `${apiPath}/searchUsers?fromUserId=${fromUserId}&keyword=${keyword}`

export const getTalkList = `${apiPath}/getTalkList`

export const register = `${apiPath}/register`

export const login = `${apiPath}/login`

export const getUserInfo = userId => `${apiPath}/getUserInfo?userId=${userId}`

export const getFriendRequestInfo = userId =>
  `${apiPath}/getFriendRequestInfo?userId=${userId}`

export const agreeMakeFriendRequest = `${apiPath}/agreeMakeFriendRequest`
