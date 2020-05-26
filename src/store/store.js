import Vue from 'vue'
import Vuex from 'vuex'
import loggedInUserModule from './modules/loggedInUserModule.js'
import socketModule from './modules/socketModule.js'
import talkModule from './modules/talkModule.js'
// import router from '../router'
import {
  CONNECT_SOCKET_IO,
  GET_USER_FRIEND_LIST,
  GET_LOGGEDINUSER_INFO,
} from '@store/types/action-types.js'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loggedInUserModule,
    socketModule,
    talkModule,
  },
  getters,
})

if (store.getters.token) {
  store.dispatch(GET_LOGGEDINUSER_INFO)
  // store.dispatch(CONNECT_SOCKET_IO)
  // store.dispatch(GET_USER_FRIEND_LIST)
} else {
  console.log('没有token')
}

window.store = store
export default store
