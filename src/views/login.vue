<template>
  <div class="login">
    <img class="logo" alt="Vue logo" src="../assets/logo.png" />
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
          登陆
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '1',
    }
  },
  methods: {
    onSubmit(values) {
      const {username, password} = values
      this.$store.dispatch('login', {
        username,
        password,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
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
