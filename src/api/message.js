import axios from '@/plugins/axios.js'

export function getMessageList(targetId) {
  return axios({
    url: '/getMessageList',
    method: 'get',
    params: {targetId},
  })
}

export function getGroupMessageList(groupId) {
  return axios({
    url: '/getGroupMessageList',
    method: 'get',
    params: {groupId},
  })
}
