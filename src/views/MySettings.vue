<template>
  <div class="my-settings">
    <my-nav-bar title="我" left-arrow />
    <div class="setting-fields">
      <van-cell-group>
        <van-field
          label="头像"
          class="user-img-field"
          is-link
          @click="showAvatarSelect"
        >
          <template v-slot:input>
            <UserAvatar :avatar="loggedInUser.avatar" width="48" height="48" />
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group>
        <van-field
          :value="loggedInUser.nickname"
          label="昵称"
          class="nickname"
          readonly
          @click="onShowNamePopup"
        />
      </van-cell-group>
    </div>

    <van-popup
      v-model="nickNamePopupVisible"
      position="bottom"
      class="nickname-popup"
      :safe-area-inset-bottom="true"
      :close-on-click-overlay="false"
      :style="{height: '25%'}"
      @opened="focusInput"
      closeable
    >
      <van-field
        v-model="nickname"
        ref="inputRef"
        label="昵称"
        placeholder="请输入昵称"
        class="nickname"
      />
      <van-button type="primary" size="large" @click="onConfirmNickName">
        保存
      </van-button>
    </van-popup>
    <van-dialog
      class="avatar-select-dialog"
      v-model="avatarSelectVisible"
      title="选择头像"
      show-cancel-button
      @confirm="onConfirmAvatar"
    >
      <avatar-select class="content" @select="onSelectAvatar" />
    </van-dialog>
    <my-tab-bar />
  </div>
</template>

<script lang="ts">
import MyTabBar from '@/components/my-tab-bar.vue'
import MyNavBar from '@/components/my-nav-bar.vue'
import AvatarSelect from '@/components/avatar-select.vue'
import UserAvatar from '@/components/user-avatar.vue'
import {CONFIRM_NICK_NAME, CONFIRM_AVATAR} from '@/store/types/action-types'
import {useStore} from '@/store/store'
import {ref} from 'vue'

export default {
  name: 'MySettings',
  components: {
    MyTabBar,
    MyNavBar,
    AvatarSelect,
    UserAvatar,
  },
  setup() {
    const store = useStore()

    const nickname = ref('') // 编辑中的昵称
    const inputRef: any = ref(null)
    const nickNamePopupVisible = ref(false)
    const avatarSelectVisible = ref(false)
    const selectAvatar = ref('')
    const loggedInUser = store.getters.loggedInUser
    function onShowNamePopup() {
      nickname.value = loggedInUser.nickname
      nickNamePopupVisible.value = true
    }
    function onConfirmNickName() {
      console.log(nickname.value)
      store.dispatch(CONFIRM_NICK_NAME, {nickname: nickname.value})
      nickNamePopupVisible.value = false
    }
    function focusInput() {
      inputRef.value && inputRef.value.focus()
    }
    function showAvatarSelect() {
      avatarSelectVisible.value = true
    }
    function onSelectAvatar(src) {
      console.log('选择了头像： ' + src)
      selectAvatar.value = src
    }
    function ConfirmAvatar() {
      console.log('修改了头像' + selectAvatar.value)
      store.dispatch(CONFIRM_AVATAR, {avatar: selectAvatar.value})
    }
    return {
      nickname,
      nickNamePopupVisible,
      avatarSelectVisible,
      selectAvatar,
      loggedInUser,
      onShowNamePopup,
      onConfirmNickName,
      focusInput,
      showAvatarSelect,
      onSelectAvatar,
      ConfirmAvatar,
      inputRef,
    }
  },
  methods: {},
}
</script>

<style lang="less" scoped>
.my-settings {
  .setting-fields {
    .user-img-field {
      display: flex;
      align-items: center;
      /deep/ .van-field__control {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
  .nickname {
    /deep/ .van-field__control {
      text-align: right;
    }
  }
  .nickname-popup {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .nickname {
      margin-top: 48px;
    }
  }
  .avatar-select-dialog {
    .content {
      padding: 32px;
    }
  }
}
</style>
