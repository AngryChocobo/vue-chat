import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'

import router from './router/index'
import './plugins/vant.js'
import './plugins/http.js'
import './plugins/icon.js'
Vue.config.productionTip = false

Vue.prototype.$moment = moment

window.loggedInUser = {
  id: 1,

  username: '高明震',
  src: 'head-1.jpg',
}

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
