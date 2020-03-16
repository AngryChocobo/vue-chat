import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/register.vue'
import Login from '../views/login.vue'
import TalkList from '../views/talk-list.vue'
import TalkView from '../views/talk-view.vue'
import FriendList from '../views/friend-list.vue'
import FriendRequestList from '../views/friend-request-list.vue'
import FriendRequestInfo from '../views/friend-request-info.vue'
import SearchUser from '../views/search-user.vue'
import UserInfo from '../views/user-info.vue'
import store from '../store/store.js'
import {Toast} from 'vant'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
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
    path: '/search-user',
    name: 'SearchUser',
    component: SearchUser,
    meta: {requireAuth: true},
  },
  {
    path: '/user-info/:userId',
    name: 'UserInfo',
    component: UserInfo,
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

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!store.state.loggedInUserModule.loggedInUser) {
      Toast('登陆失效，请重新登录')
      router.replace('/login')
    }
  }
  next()
})

export default router
