const apiPath = 'http://localhost:8888'

export const getMessageList = (fromUserId, toUserId) =>
  `${apiPath}/getMessageList?fromUserId=${fromUserId}&toUserId=${toUserId}`

// export const sendNewMessage = `${apiPath}/sendNewMessage`
export const getUserFriendList = userId =>
  `${apiPath}/getUserFriendList?userId=${userId}`

export const getTalkTargetInfo = userId =>
  `${apiPath}/getTalkTargetInfo?userId=${userId}`

export const searchUsers = (fromUserId, keyword) =>
  `${apiPath}/searchUsers?fromUserId=${fromUserId}&keyword=${keyword}`

export const getFriendInfo = (userId, friendId) =>
  `${apiPath}/getFriendInfo?userId=${userId}&friendId=${friendId}`
