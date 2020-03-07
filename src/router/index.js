import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/register.vue'
import Login from '../views/login.vue'
import TalkList from '../views/talk-list.vue'
import TalkView from '../views/talk-view.vue'
import FriendList from '../views/friend-list.vue'
import SearchUser from '../views/search-user.vue'
import store from '../plugins/store'
import {Toast} from 'vant'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: null,
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
    path: '/search-user',
    name: 'SearchUser',
    component: SearchUser,
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
    if (!store.state.loggedInUser) {
      Toast('登陆失效，请重新登录')
      router.replace('/login')
    }
  }
  next()
})

export default router
