<template>
  <div class="register">
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{required: true, message: '请填写用户名'}]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{required: true, message: '请填写密码'}]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {register} from '@const/api'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values)
      // this.$store.commit('register', values)
      this.axios.post(register, values).then(res => {
        if (res.data) {
            this.$toast('注册成功')
        }
      })
      
    },
  },
}
</script>

<style lang="less" scoped></style>
