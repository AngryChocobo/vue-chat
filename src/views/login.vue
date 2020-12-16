<template>
  <div class="login">
    <img class="logo" alt="Vue logo" src="../assets/logo.png" />
    <van-form @submit="onSubmit" style="padding: 0 30px">
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
      <div style="margin: 16px 16px 32px 16px; ">
        <van-button round block type="primary" native-type="submit">
          登陆
        </van-button>
      </div>
      <div
        class="guest"
        style="text-align: center; color: gray"
        @click="guestLogin"
      >
        <span>
          游客登录
        </span>
      </div>
    </van-form>
  </div>
</template>

<script>
import {LOGIN, GUEST_LOGIN} from '@store/types/action-types.js'

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
      const {username, password} = values
      this.$store.dispatch(LOGIN, {
        username,
        password,
      })
    },
    guestLogin() {
      this.$store.dispatch(GUEST_LOGIN)
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .logo {
    display: block;
    width: 60%;
    margin: 0 auto;
  }
}
</style>
