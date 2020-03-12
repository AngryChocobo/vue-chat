import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'

import './plugins/vant.js'
import './plugins/axios.js'
import './plugins/icon.js'
import './plugins/socketio.js'
import router from './router/index'
import store from './store/store.js'
Vue.config.productionTip = false

Vue.prototype.$moment = moment

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
