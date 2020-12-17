import {createApp} from 'vue'
// import moment from 'moment'
import App from './App.vue'
import store, {key} from './store/store'
import router from './router'
import * as Vant from 'vant'
import 'vant/lib/index.css'

// import './plugins/notification'

console.log('env: ', process.env)

// Vue.prototype.$moment = moment

createApp(App)
  .use(router)
  .use(store, key)
  .use(Vant)
  .mount('#app')
