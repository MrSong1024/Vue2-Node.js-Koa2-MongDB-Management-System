<template>
  <div class="navbar ui-flex ui-cont-sb">
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <!-- 通知公告 -->
    <div class="ui-flex ui-flex-1 ui-cont-center ui-h-40 ui-overflow-hidden">
      <el-carousel
        height="40px"
        style="width: 100%"
        direction="vertical"
        autoplay
        indicator-position="none"
        class="ui-flex-1"
      >
        <el-carousel-item v-for="(item, index) in tableData" :key="index">
          <h3 class="medium ui-cous" @click="detialFn(item)">
            {{ item.noticeTitle }}
          </h3>
        </el-carousel-item>
      </el-carousel>

      <div class="ui-pdt-4 ui-mgr-10">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-money"
          @click="orderAddFn()"
          v-permission="['admin', 'pay:list']"
          >账户充值</el-button
        >
        <el-button
          type="defult"
          size="mini"
          icon="el-icon-service"
          @click="serviceFn()"
          >在线客服</el-button
        >
      </div>
    </div>
    <div class="right-menu">
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <span class="user-title">{{ userName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <span
            style="display: block"
            @click="fn_personalCenter()"
            v-permission="['admin', 'profile:list']"
          >
            <el-dropdown-item> 个人中心 </el-dropdown-item>
          </span>
          <span style="display: block" @click="loginOut">
            <el-dropdown-item> 退出登录 </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 推送消息 -->
      <div class="message">
        <el-badge :value="1" type="primary">
          <i class="el-icon-chat-dot-square"></i>
        </el-badge>
      </div>
      <!-- 页面最大化 -->
      <div class="ui-pdr-10">
        <screenfull class="ui-cous" />
      </div>
    </div>

    <!-- 查看公告详情 -->
    <el-dialog
      title="查看详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="620px"
      append-to-body
    >
      <div style="height: 400px" v-html="noticeContent"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getNoticeAll } from "@http/information/notice.js";
import { loginOut } from "@http/login/login.js";
import Breadcrumb from "@/components/Breadcrumb";
import { removeToken } from "@/utils/auth";
import screenfull from "@/components/Screenfull";
export default {
  components: {
    Breadcrumb,
    screenfull,
  },
  data() {
    return {
      userName: "",
      tableData: [],
      dialogVisible: false,
      noticeContent: null,
    };
  },
  created() {
    this.userName = this.$store.getters.user.username;

    // 获取5条公告信息
    getNoticeAll({
      type: 1,
      page: 0,
      size: 5,
    }).then((res) => {
      this.tableData = res.data;
    });
  },
  methods: {
    /**
     * @Author: Songjq
     * @Date: 2021-12-12 13:15:24
     * @Fn: 退出登录
     */
    loginOut() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.logout();
      });
    },
    logout() {
      loginOut().then((res) => {
        this.$notify({
          title: "退出成功",
          type: "success",
          duration: 2500,
        });
        removeToken();
        location.reload();
      });
    },
    /**
     * @Author: Songjq
     * @Date: 2022-02-09 10:08:00
     * @Fn:个人中心
     */
    fn_personalCenter() {
      this.$router.push({ path: "/home/profile" });
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:32:55
     * @Fn:查看公告
     */
    detialFn(row) {
      this.noticeContent = row.noticeContent;
      this.dialogVisible = true;
    },

    // 账户充值
    orderAddFn() {
      this.$router.push({
        path: "/finance/pay",
      });
    },

    // 在线客服系统
    serviceFn() {
      window.open(
        "https://xbchat.kmxs.com.cn/index/index/home?business_id=1&groupid=0&special=1&theme=05202d"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #97a8be;
  line-height: 40px;
  margin: 0;
  text-align: center;
}
</style>
