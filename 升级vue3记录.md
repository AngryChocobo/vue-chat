# 记录升级版本的过程

- 第一步忘了干了个啥，vue 相关的 package.json 依赖都自动升到了 3

- 将 2.x 项目中的@click.native 直接改为@click

- 旧的 `slot="xx"` 语法改为 `v-slot:xx`

- 之前在 Vue 原型上的操作 不再需要了，如 `Vue.prototype.$axios = service`

- Vuex 的 dispatch

```js
import {useStore} from 'vuex'
const store = useStore()
store.dispatch('xxx')
```

但是 useStore 只能用在 setup 中，所以～

- router 同理，必须改造完 setup 才能使用 useRouter

- `Vue.set` 修改
