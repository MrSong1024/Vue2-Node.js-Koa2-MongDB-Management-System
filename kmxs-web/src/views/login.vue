<!--
 * @Author: Songjq
 * @Date: 2022-05-02 22:58:54
 * @Desscription: 登录
-->
<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-head">
        <div
          class="icon"
          v-for="item in loginTypeOptions"
          :key="item.value"
          @click="changeType(item.value)"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </div>

      <!-- 操作界面 -->
      <Account
        ref="account"
        @setSecondAuthTypeOptions="setSecondAuthTypeOptions"
        v-if="loginType == 'account'"
      />

      <Email ref="email" v-else-if="loginType == 'email'" />
      <Phone ref="phone" v-else-if="loginType == 'phone'" />

      <!-- 切换页面按钮 -->
      <div class="login-form-footer">
        <el-button type="text" size="medium" @click="forgetPassword">
          忘记密码？
        </el-button>
        <el-button type="text" size="medium" @click="register">
          注册
        </el-button>
      </div>
    </div>

    <!--  底部  -->
    <footer />

    <!-- 开启二次认证 -->
    <SecondAuth
      ref="secondAuth"
      :isSecondAuthTypeOptions="isSecondAuthTypeOptions"
    />
  </div>
</template>

<script>
import Footer from "./footer.vue";
import SecondAuth from "@/components/Login/SecondAuth.vue";
import Account from "@/components/Login/Account.vue";
import Email from "@/components/Login/Email.vue";
import Phone from "@/components/Login/Phone.vue";
export default {
  name: "Login",
  components: { Footer, SecondAuth, Account, Email, Phone },
  data() {
    return {
      loginType: "account",
      loginTypeOptions: [
        { value: "account", label: "账号登录", icon: "el-icon-user" },
        { value: "email", label: "邮箱登录", icon: "el-icon-message" },
        { value: "phone", label: "短信登录", icon: "el-icon-mobile-phone" },
      ],
      isSecondAuthTypeOptions: [], // 可选认证类型
    };
  },
  created() {
    // IP = returnCitySN['cip'] // ip
    // adress = returnCitySN["cname"] // 地址
  },
  methods: {
    /**
     * @Author: Songjq
     * @Date: 2022-01-19 14:43:05
     * @Fn: 切换登陆类型
     */
    changeType(type) {
      this.loginType = type;
    },

    /**
     * 设置可选认证类型
     */
    setSecondAuthTypeOptions(types) {
      this.isSecondAuthTypeOptions = types;
      this.$refs.secondAuth.dialog = true;
    },

    /**
     * @Author: Songjq
     * @Date: 2022-01-18 10:09:24
     * @Fn: 注册
     */
    register() {
      this.$router.push({
        path: "/register",
      });
    },
    /**
     * @Author: Songjq
     * @Date: 2022-01-18 17:50:13
     * @Fn: 忘记密码
     */
    forgetPassword() {
      this.$router.push({
        path: "/forgetPassword",
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
