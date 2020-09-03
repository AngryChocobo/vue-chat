import axios from '@/plugins/axios.js'

export function login(data) {
  return axios({
    url: '/login',
    method: 'post',
    data,
  })
}

export function register(data) {
  return axios({
    url: '/register',
    method: 'post',
    data,
  })
}

export function getLoggedInUserInfo() {
  return axios({
    url: '/getLoggedInUserInfo',
    method: 'get',
  })
}

export function confirmNickName(data) {
  return axios({
    url: '/confirmNickName',
    method: 'post',
    data,
  })
}

export function confirmAvatar(data) {
  return axios({
    url: '/confirmAvatar',
    method: 'post',
    data,
  })
}
export function getUserInfo(userId) {
  return axios({
    url: '/getUserInfo',
    method: 'get',
    params: {userId},
  })
}

export function getUserInfoAndFriendRelation(targetUserId) {
  return axios({
    url: '/getUserInfoAndFriendRelation',
    method: 'get',
    params: {targetUserId},
  })
}

export function getMessageList(targetId) {
  return axios({
    url: '/getMessageList',
    method: 'get',
    params: {targetId},
  })
}

export function getSearchUserResult(keyword) {
  return axios({
    url: '/searchUsers',
    method: 'get',
    params: {keyword},
  })
}

export function getFriendRequestInfo(userId) {
  return axios({
    url: '/getFriendRequestInfo',
    method: 'get',
    params: {userId},
  })
}
