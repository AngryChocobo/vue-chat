import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'
import store from './store/store.js'
import router from './router/index.js'

import './plugins/vant.js'
import './plugins/icon.js'
import './plugins/notification.js'
Vue.config.productionTip = false

console.log('env: ', process.env)

Vue.prototype.$moment = moment

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')
