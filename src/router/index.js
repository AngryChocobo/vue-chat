import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import TalkList from '../views/talk-list.vue'
import TalkView from '../views/talk-view.vue'
import FriendList from '../views/friend-list.vue'
import SearchUser from '../views/search-user.vue'

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
    path: '/talk-list',
    name: 'TalkList',
    component: TalkList,
  },
  {
    path: '/talk-view/:id',
    name: 'TalkView',
    component: TalkView,
  },
  {
    path: '/friend-list',
    name: 'FriendList',
    component: FriendList,
  },
  {
    path: '/search-user',
    name: 'SearchUser',
    component: SearchUser,
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

export default router
