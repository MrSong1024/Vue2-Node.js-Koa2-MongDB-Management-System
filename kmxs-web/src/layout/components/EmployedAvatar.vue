<template>
  <div class="nav-bar">
    <div class="left-main">
      <div class="logo-container">
        <img
          class="left-logo"
          alt="logo"
          src="../../assets/images/kmxs-head.png"
        >
      </div>
      <div class="project-name">{{ managerInfo }}</div>
    </div>
    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span class="user-title">{{ user.nickName ? user.nickName : user.username }}</span>
          <!--              <i class="el-icon-caret-bottom" />-->
        </div>
        <!--            <el-dropdown-menu slot="dropdown">-->
        <!--              <span style="display:block;" @click="open">-->
        <!--                <el-dropdown-item>-->
        <!--                  退出登录-->
        <!--                </el-dropdown-item>-->
        <!--              </span>-->
        <!--            </el-dropdown-menu>-->
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Avatar from "@/assets/images/avatar.png";

export default {
  name: "EmployedAvatar",
  props: {
    msg: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      Avatar: Avatar,
      dialogVisible: false,
      managerInfo: this.$props.msg,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    show: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val,
        });
      },
    },
  },
  methods: {
    open() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.ssoLogout();
      });
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload();
      });
    },
    ssoLogout() {
      this.$store.dispatch("SSOLogOut").then(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-bar {
  position: relative;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  height: 40px;
  background: #2761ff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .left-main {
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #fff;
  }
  .logo-container {
    display: inline-block;
  }
  .project-name {
    position: relative;
    margin-left: 10px;
    padding-left: 10px;
  }
  .project-name::before {
    position: absolute;
    left: 0;
    top: 6px;
    height: 100%;
    width: 1px;
    content: " ";
    border-left: 1px solid #fff;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .text-desc {
    display: inline-block;
  }
  .left-main {
    height: 30px;
    line-height: 30px;
    margin-top: 5px;
  }
  .left-main .left-logo {
    display: inline-block;
    height: 30px;
    width: auto;
    font-size: 0;
  }
  .right-menu {
    height: 100%;
    line-height: 40px;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 12px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      /*margin-right: 30px;*/

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
        }

        .user-title {
          font-size: 12px;
          font-weight: 400;
          color: #fff;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 13px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
  }
}
.el-dropdown-menu--small .el-dropdown-menu__item {
  font-size: 12px;
}
</style>
