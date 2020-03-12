import Vue from 'vue'
import Vuex from 'vuex'
// import {Toast} from 'vant'
// import router from '../router/index'
// import io from 'socket.io-client'
// import {getMessageList, SOCKETIO_PATH, register, login} from '@const/api.js'
// import axios from '../plugins/axios.js'
import loggedInUserModule from './modules/loggedInUserModule.js'
import socketModule from './modules/socketModule.js'
import talkModule from './modules/talkModule.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    loggedInUserModule,
    socketModule,
    talkModule,
  },
})

store.dispatch('connectSocketIO')
console.log(store)
window.store = store
export default store