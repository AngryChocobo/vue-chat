import axios from '@/plugins/axios.js'

export function getMessageList(targetId) {
  return axios({
    url: '/talk/getMessageList',
    method: 'get',
    params: {targetId},
  })
}
