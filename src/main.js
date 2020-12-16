import {createApp} from 'vue'
// import moment from 'moment'
import App from './App.vue'
import store from './store/store'
import router from './router/index'
import Vant from 'vant'
import 'vant/lib/index.css'

// import './plugins/vant'
// import './plugins/icon'
// import './plugins/notification'

console.log('env: ', process.env)

// Vue.prototype.$moment = moment

createApp(App)
  .use(router)
  .use(store)
  .use(Vant)
  .mount('#app')
