<template>
  <div class="register">
    <img class="logo" alt="Vue logo" src="../assets/logo.png" />
    <van-form @submit="onSubmit" style="padding: 0 30px">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        autocomplete="false"
        :rules="[{required: true, message: '请填写用户名'}]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        autocomplete="false"
        :rules="[{required: true, message: '请填写密码'}]"
      />
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import {REGISTER} from '@store/types/action-types.js'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    onSubmit(values) {
      const {username, password} = values
      this.$store.dispatch(REGISTER, {
        username,
        password,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.register {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // background-image: url('../assets/timg.jpeg');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  .logo {
    display: block;
    width: 60%;
    margin: 0 auto;
  }
  .van-cell {
    background: transparent;
  }
  /deep/ .van-field__label {
    color: black;
  }
}
</style>
