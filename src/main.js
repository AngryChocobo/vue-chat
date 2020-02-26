import Vue from 'vue'
import App from './App.vue'
import {
  NavBar,
  Tabbar,
  TabbarItem,
  Button,
  Col,
  Row,
  Form,
  Field,
  Toast,
  Notify,
  Cell,
  List,
} from 'vant'
import router from './router/index'
import 'vant/lib/index.css'
import './plugins/element.js'

Vue.config.productionTip = false

Vue.use(NavBar)
  .use(Col)
  .use(Row)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Button)
  .use(Form)
  .use(Field)
  .use(Toast)
  .use(Notify)
  .use(Cell)
  .use(List)

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
