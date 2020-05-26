import axios from '@/plugins/axios.js'
const apiPath = 'http://localhost:3000'
export const SOCKETIO_PATH = 'http://localhost:3000'

export function login(data) {
  return axios({
    url: `${apiPath}/login`,
    method: 'post',
    data,
  })
}

export function register(data) {
  return axios({
    url: `${apiPath}/register`,
    method: 'post',
    data,
  })
}

export function getLoggedInUserInfo() {
  return axios({
    url: `${apiPath}/getLoggedInUserInfo`,
    method: 'get',
  })
}

export function confirmNickName(data) {
  return axios({
    url: `${apiPath}/confirmNickName`,
    method: 'post',
    data,
  })
}

export function confirmAvatar(data) {
  return axios({
    url: `${apiPath}/confirmAvatar`,
    method: 'post',
    data,
  })
}
export function getUserInfo(data) {
  return axios({
    url: `${apiPath}/getUserInfo`,
    method: 'get',
    data,
  })
}

export function getUserInfoAndFriendRelation(data) {
  return axios({
    url: `${apiPath}/getUserInfoAndFriendRelation`,
    method: 'get',
    data,
  })
}
