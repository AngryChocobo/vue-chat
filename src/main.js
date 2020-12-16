import {createApp} from 'vue'
// import moment from 'moment'
import App from './App.vue'
import store from './store/store.js'
import router from './router/index.js'
import Vant, {AddressEdit} from 'vant'
import 'vant/lib/index.css'

// import './plugins/vant.js'
// import './plugins/icon.js'
// import './plugins/notification.js'

console.log('env: ', process.env)
console.log('env: ', AddressEdit)
console.log('vant: ', Vant)

// Vue.prototype.$moment = moment

createApp(App)
  .use(router)
  .use(store)
  .use(Vant)
  .mount('#app')
