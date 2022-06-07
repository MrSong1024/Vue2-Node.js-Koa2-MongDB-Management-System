<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <img :src="hbImg" class="">
  </div>
</template>

<script>
import HamburgerImg from '@/assets/images/hamburger_ctrl_btn.png'

export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hbImg: HamburgerImg
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
