import axios from '@/plugins/axios.js'

export function getGroupInfo(id) {
  return axios({
    url: '/group/getGroupInfo',
    method: 'get',
    params: {id},
  })
}

export function getGroupMessageList(groupId) {
  return axios({
    url: '/group/getGroupMessageList',
    method: 'get',
    params: {groupId},
  })
}
