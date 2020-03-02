const apiPath = 'http://localhost:8888'

export const getTalkViewDetail = (fromUserId, toUserId) =>
  `${apiPath}/getTalkViewDetail?fromUserId=${fromUserId}&toUserId=${toUserId}`
