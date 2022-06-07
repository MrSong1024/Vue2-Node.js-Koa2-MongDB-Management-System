<!--
 * @Author: Songjq
 * @Date: 2021-12-06 23:18:14
 * @Desscription: 
-->
<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <div class="ui-flex ui-items-center ui-cont-center">
        <h1 class="sidebar-title">{{ title }}</h1>
      </div>
    </transition>
  </div>
</template>

<script>
import Icon from "@/assets/images/kmxs-head.png";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      logoImg: Icon,
      title: "Kmxs后台管理系统",
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 60px;
  background: #002240;
  line-height: 60px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .logoImg {
    width: 30px;
    height: 30px;
  }
  .sidebar-title {
    padding-left: 10px;
    color: #fff;
    font-weight: 200;
    font-size: 18px;
    vertical-align: middle;
  }
  &.collapse {
    .sidebar-title {
      margin-right: 0px;
      display: none;
      vertical-align: middle;
    }
  }
}
</style>
