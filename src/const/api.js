const apiPath = 'http://localhost:8888'

export const getMessageList = (fromUserId, toUserId) =>
  `${apiPath}/getMessageList?fromUserId=${fromUserId}&toUserId=${toUserId}`

export const sendNewMessage = `${apiPath}/sendNewMessage`
export const getUserFriendList = userId =>
  `${apiPath}/getUserFriendList?userId=${userId}`
