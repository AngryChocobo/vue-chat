import axios from '@/plugins/axios'

export function login(data: any) {
  return axios({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function register(data: any) {
  return axios({
    url: '/user/register',
    method: 'post',
    data,
  })
}

export function guestLogin() {
  return axios({
    url: '/user/guestLogin',
    method: 'post',
  })
}

export function getLoggedInUserInfo() {
  return axios({
    url: '/user/getLoggedInUserInfo',
    method: 'get',
  })
}

export function confirmNickName(data: any) {
  return axios({
    url: '/setting/nickname',
    method: 'put',
    data,
  })
}

export function confirmAvatar(data: any) {
  return axios({
    url: '/setting/avatar',
    method: 'put',
    data,
  })
}
export function getUserInfo(userId: any) {
  return axios({
    url: '/user/getUserInfo',
    method: 'get',
    params: {userId},
  })
}

export function getUserInfoAndFriendRelation(targetUserId: any) {
  return axios({
    url: '/friend/getUserInfoAndFriendRelation',
    method: 'get',
    params: {targetUserId},
  })
}

export function getSearchUserResult(keyword: any) {
  return axios({
    url: '/searchUsers',
    method: 'get',
    params: {keyword},
  })
}

export function getFriendRequestInfo(userId: any) {
  return axios({
    url: '/friend/getFriendRequestInfo',
    method: 'get',
    params: {userId},
  })
}

export function fetchUserEmojiList() {
  return axios({
    url: '/fetchUserEmojiList',
    method: 'get',
  })
}
