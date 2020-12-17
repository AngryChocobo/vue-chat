import {createStore, Store, useStore as baseUseStore} from 'vuex'
import loggedInUserModule, {
  LoggedInUserState,
} from './modules/loggedInUserModule'
import socketModule, {SocketState} from './modules/socketModule'
import talkModule, {TalkState} from './modules/talkModule'

import {
  CONNECT_SOCKET_IO,
  GET_USER_FRIEND_LIST,
  GET_USER_GROUP_LIST,
  GET_LOGGEDINUSER_INFO,
} from '@/store/types/action-types'
import getters from './getters'
import {InjectionKey} from 'vue'

export interface RootState {
  loggedInUserModule: LoggedInUserState
  socketModule: SocketState
  talkModule: TalkState
}

export const key: InjectionKey<Store<RootState>> = Symbol()

const store = createStore<RootState>({
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

export function useStore() {
  return baseUseStore(key)
}

// window.store = store
export default store
