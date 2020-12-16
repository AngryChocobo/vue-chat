import axios from '@/plugins/axios'

export function getGroupInfo(id: any) {
  return axios({
    url: '/group/getGroupInfo',
    method: 'get',
    params: {id},
  })
}

export function getGroupMessageList(groupId: any) {
  return axios({
    url: '/group/getGroupMessageList',
    method: 'get',
    params: {groupId},
  })
}
