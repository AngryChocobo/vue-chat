import Vue from 'vue'
import Vuex from 'vuex'
import loggedInUserModule from './modules/loggedInUserModule.js'
import socketModule from './modules/socketModule.js'
import talkModule from './modules/talkModule.js'
import {CONNECT_SOCKET_IO} from '@store/types/action-types.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loggedInUserModule,
    socketModule,
    talkModule,
  },
})

store.dispatch(CONNECT_SOCKET_IO)

// console.log(store)
window.store = store
export default store
