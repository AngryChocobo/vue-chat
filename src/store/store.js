import {createStore} from 'vuex'
import loggedInUserModule from './modules/loggedInUserModule.js'
import socketModule from './modules/socketModule.js'
import talkModule from './modules/talkModule.js'

import {
  CONNECT_SOCKET_IO,
  GET_USER_FRIEND_LIST,
  GET_USER_GROUP_LIST,
  GET_LOGGEDINUSER_INFO,
} from '@store/types/action-types.js'
import getters from './getters'

const store = createStore({
  modules: {
    loggedInUserModule,
    socketModule,
    talkModule,
  },
  getters,
})

if (store.getters.token) {
  store.dispatch(GET_LOGGEDINUSER_INFO).then(() => {
    store.dispatch(CONNECT_SOCKET_IO).then(() => {
      store.dispatch(GET_USER_FRIEND_LIST)
      store.dispatch(GET_USER_GROUP_LIST)
    })
  })
} else {
  console.log('没有token')
}

window.store = store
export default store
