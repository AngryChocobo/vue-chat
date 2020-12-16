import {createStore} from 'vuex'
import loggedInUserModule from './modules/loggedInUserModule'
import socketModule from './modules/socketModule'
import talkModule from './modules/talkModule'

import {
  CONNECT_SOCKET_IO,
  GET_USER_FRIEND_LIST,
  GET_USER_GROUP_LIST,
  GET_LOGGEDINUSER_INFO,
} from '@/store/types/action-types'
import getters from './getters'

const store = createStore({
  modules: {
    loggedInUserModule,
    socketModule,
    talkModule,
  },
  getters: getters,
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

// window.store = store
export default store
