import axios from '@/plugins/axios'

export function getMessageList(targetId: any) {
  return axios({
    url: '/talk/getMessageList',
    method: 'get',
    params: {targetId},
  })
}
