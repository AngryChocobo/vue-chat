import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue'
import My from '../views/My.vue'
import MySettings from '../views/MySettings.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import TalkList from '../views/TalkList.vue'
import TalkView from '../views/TalkView.vue'
import GroupTalkView from '../views/GroupTalkView.vue'
import FriendList from '../views/FriendList.vue'
import FriendRequestList from '../views/FriendRequestList.vue'
import FriendRequestInfo from '../views/FriendRequestInfo.vue'
import SearchUserAndGroup from '../views/SearchUserAndGroup.vue'
import UserInfo from '../views/UserInfo.vue'
import CreateGroup from '../views/CreateGroup.vue'

import store from '../store/store.js'
import {Toast} from 'vant'

import {RESET_RECONNECT_OVERLAY} from '@store/types/mutation-types.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    // redirect: '/login',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/talk-list',
    name: 'TalkList',
    component: TalkList,
    meta: {requireAuth: true},
  },
  {
    path: '/talk-view/:id',
    name: 'TalkView',
    component: TalkView,
    meta: {requireAuth: true},
  },
  {
    path: '/group-talk-view/:id',
    name: 'GroupTalkView',
    component: GroupTalkView,
    meta: {requireAuth: true},
  },
  {
    path: '/friend-list',
    name: 'FriendList',
    component: FriendList,
    meta: {requireAuth: true},
  },
  {
    path: '/friend-request-list',
    name: 'FriendRequestList',
    component: FriendRequestList,
    meta: {requireAuth: true},
  },
  {
    path: '/friend-request-list/:userId',
    name: 'FriendRequestInfo',
    component: FriendRequestInfo,
    meta: {requireAuth: true},
  },
  {
    path: '/search',
    name: 'SearchUserAndGroup',
    component: SearchUserAndGroup,
    meta: {requireAuth: true},
  },
  {
    path: '/user-info/:userId',
    name: 'UserInfo',
    component: UserInfo,
    meta: {requireAuth: true},
  },
  {
    path: '/my',
    name: 'My',
    component: My,
    meta: {requireAuth: true},
  },
  {
    path: '/my-settings',
    name: 'MySettings',
    component: MySettings,
    meta: {requireAuth: true},
  },
  {
    path: '/create-group',
    name: 'CreateGroup',
    component: CreateGroup,
    meta: {requireAuth: true},
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!store.getters.token) {
      Toast('登陆失效，请重新登录')
      router.replace('/login')
    }
  } else {
    if (store.state.socketModule.socket) {
      store.state.socketModule.socket.close()
    }
  }
  store.commit(RESET_RECONNECT_OVERLAY)
  next()
})

export default router
