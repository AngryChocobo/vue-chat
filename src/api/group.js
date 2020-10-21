import axios from '@/plugins/axios.js'

export function getGroupInfo(id) {
  return axios({
    url: '/getGroupInfo',
    method: 'get',
    params: {id},
  })
}
