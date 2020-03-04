import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'

import router from './router/index'
import './plugins/vant.js'
import './plugins/http.js'
import './plugins/icon.js'
import './plugins/socketio.js'
import store from './plugins/store'
Vue.config.productionTip = false

Vue.prototype.$moment = moment

window.loggedInUser = {
  id: 1,
  username: '高明震',
  src: 'head-1.jpg',
}

store.dispatch('login')

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app')
