<template>
  <div class="avatar-select">
    <img
      v-for="avatar in avatarList"
      :key="avatar.src"
      :src="avatar.src | imgSrcFilter"
      alt="头像"
      class="avatar"
      @click="selectAvatar(avatar.src)"
    />
  </div>
</template>

<script>
export default {
  name: 'AvatarSelect',
  props: {},
  mounted() {},
  data() {
    return {
      avatarList: [
        {
          name: '头1',
          src: 'head-1.jpg',
        },
        {
          name: '头2',
          src: 'head-2.jpg',
        },
        {
          name: '头3',
          src: 'head-3.jpg',
        },
        {
          name: '头4',
          src: 'head-4.jpg',
        },
        {
          name: '头5',
          src: 'head-5.jpg',
        },
        {
          name: '头6',
          src: 'head-6.jpg',
        },
        {
          name: '头7',
          src: 'head-7.jpg',
        },
        {
          name: '头8',
          src: 'head-8.jpg',
        },
        {
          name: '头9',
          src: 'head-9.jpg',
        },
      ],
    }
  },
  filters: {
    imgSrcFilter(src) {
      return src
        ? require('@assets/head/' + src)
        : require('@assets/head/head.jpg')
    },
  },
  computed: {},
  methods: {
    selectAvatar(src) {
      this.emit('select', src)
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-select {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 8px;
  row-gap: 8px;
  .avatar {
    width: 100%;
  }
}
</style>
