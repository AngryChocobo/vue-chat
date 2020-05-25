const apiPath = 'http://localhost:3000'
export const SOCKETIO_PATH = 'http://localhost:3000'

export const testApi = `${apiPath}`

export const getMessageList = (fromUserId, targetId) =>
  `${apiPath}/getMessageList?fromUserId=${fromUserId}&targetId=${targetId}`

// export const sendNewMessage = `${apiPath}/sendNewMessage`
export const getUserFriendList = `${apiPath}/getUserFriendList`

export const getTalkTargetInfo = userId =>
  `${apiPath}/getTalkTargetInfo?userId=${userId}`

export const searchUsers = keyword =>
  `${apiPath}/searchUsers?keyword=${keyword}`

export const register = `${apiPath}/register`

export const login = `${apiPath}/login`

export const getUserInfo = targetUserId =>
  `${apiPath}/getUserInfo?targetUserId=${targetUserId}`

export const getFriendRequestInfo = userId =>
  `${apiPath}/getFriendRequestInfo?userId=${userId}`

export const confirmNickName = `${apiPath}/confirmNickName`
