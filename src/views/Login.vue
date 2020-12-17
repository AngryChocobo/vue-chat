<template>
  <div class="login">
    <img class="logo" alt="Vue logo" src="../assets/logo.png" />
    <van-form @submit="onSubmit" style="padding: 0 30px">
      <van-field
        v-model="form.username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{required: true, message: '请填写用户名'}]"
      />
      <van-field
        v-model="form.password"
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

<script lang="ts">
import {LOGIN, GUEST_LOGIN} from '@/store/types/action-types'
import {useStore} from '@/store/store'
import {reactive} from 'vue'
export default {
  name: 'Login',
  setup() {
    const store = useStore()

    const form = reactive({
      username: '',
      password: '',
    })
    function onSubmit() {
      store.dispatch(LOGIN, form)
    }
    function guestLogin() {
      store.dispatch(GUEST_LOGIN)
    }
    return {
      form,
      onSubmit,
      guestLogin,
    }
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
