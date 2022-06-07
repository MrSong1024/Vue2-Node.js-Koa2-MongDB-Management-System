<!--
 * @Author: Songjq
 * @Date: 2021-08-04 17:11:14
 * @Desscription:
-->
<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="$store.state.settings.uniqueOpened"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route,index) in permission_routers"
          :key="index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";
import Hamburger from "@/components/Hamburger";

export default {
  components: { SidebarItem, Logo, Hamburger },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>

<style lang="scss" scoped>
.hamburger-container {
  line-height: 40px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  position: absolute;
  bottom: 0px;
  z-index: 100;
  left: 0px;
  text-align: right;
  right: 0px;
  box-sizing: border-box;
  padding-right: 17px;
  color: #5f6c78;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>
