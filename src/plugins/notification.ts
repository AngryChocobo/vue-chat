import store from '@/store/store'
import {NOTIFICATION_GRANTED} from '@/store/types/action-types'

if (window.Notification && window.Notification.permission != 'denied') {
  Notification.requestPermission(function(permission) {
    if (permission == 'granted') {
      store.dispatch(NOTIFICATION_GRANTED)
    }
  })
}
