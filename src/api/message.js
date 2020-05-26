import axios from '@/plugins/axios.js'
const apiPath = 'http://localhost:3000'
export const SOCKETIO_PATH = 'http://localhost:3000'

export function getMessageList(targetId) {
  return axios({
    url: `${apiPath}/getMessageList`,
    method: 'get',
    params: {targetId},
  })
}
