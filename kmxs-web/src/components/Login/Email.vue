<!--
 * @Author: Songjq
 * @Date: 2022-05-02 22:58:54
 * @Desscription: 邮箱登录
-->
<template>
  <div class="login-form-body" v-loading.fullscreen.lock="fullscreenLoading">
    <h3 class="login-title" v-if="isShowTitle">邮箱登录</h3>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="email">
        <el-input
          v-model="form.email"
          placeholder="邮箱账号"
          :disabled="isDisabled"
          @keyup.enter.native="handleLogin()"
          class="ui-flex-1"
          size="medium"
        >
          <svg-icon
            slot="prefix"
            icon-class="email"
            class="el-input__icon input-icon ui-mgl-6"
          />
        </el-input>
      </el-form-item>

      <el-form-item prop="code">
        <div class="ui-flex">
          <el-input
            v-model="form.code"
            placeholder="图形验证码"
            @keyup.enter.native="handleLogin()"
            class="ui-flex-1"
            size="medium"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon ui-mgl-6"
            />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" v-if="codeUrl" @click="getCode" />
          </div>
        </div>
      </el-form-item>

      <el-form-item prop="emailCode">
        <div class="ui-flex">
          <el-input
            v-model="form.emailCode"
            placeholder="输入4位动态验证码"
            class="ui-flex-1"
            size="medium"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon ui-mgl-6"
            />
          </el-input>
          <div class="login-code">
            <el-button
              type="primary"
              style="width: 100%"
              plain
              :loading="btnCodeLoad"
              :disabled="btnCodeLoading"
              size="medium"
              @click="stepOne()"
              >{{
                btnCodeLoading ? times + "S后重新获取" : "获取验证码"
              }}</el-button
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="btnLoading"
          type="primary"
          style="width: 100%"
          size="medium"
          @click.native.prevent="handleLogin()"
        >
          <span>{{ btnShowText }}</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import login from "@/mixins/login.js";
import { sendMail } from "@http/login/login.js";
import { validEmail } from "@/utils/validate.js";
import { postUsersChangeEmail } from "@http/system/user.js";
export default {
  name: "Login",
  mixins: [login],
  components: {},
  props: {
    // 是否展示标题
    isShowTitle: {
      type: Boolean,
      default: true,
    },
    // 是否首次登录
    isChangeEmail: {
      type: Boolean,
      default: false,
    },
    // 是否初始化父级数据
    isInit: {
      type: Boolean,
      default: false,
    },
    // 邮箱输入框是否禁用
    isDisabled: {
      type: Boolean,
      default: false,
    },
    // 按钮提示文字
    btnShowText: {
      type: String,
      default: "登录",
    },
    // 邮箱账号
    valueAlias: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      form: {
        email: "",
        code: "",
        emailCode: "",
      },
      rules: {
        email: [
          { required: true, trigger: "blur", message: "邮箱为必填" },
          { trigger: "blur", validator: validEmail },
        ],
        code: [
          { required: true, trigger: "blur", message: "图形验证码为必填" },
        ],
        emailCode: [
          { required: true, trigger: "blur", message: "动态验证码为必填" },
        ],
      },
      btnLoading: false,
      btnCodeLoading: false,
      btnCodeLoad: false,
      // 二维码
      codeUrl: "",
      // 倒计时
      times: 60,
      // 定时器
      timer: null,
      fullscreenLoading: false,
    };
  },
  created() {
    this.form.email = this.valueAlias;
  },
  methods: {
    /**
     * 获取动态验证码
     */
    stepOne() {
      if (!this.form.email) {
        this.$notify({
          title: "请补全邮箱信息",
          type: "warning",
        });
        return;
      }

      if (!this.form.code) {
        this.$notify({
          title: "请补全图形验证码信息",
          type: "warning",
        });
        return;
      }

      this.btnCodeLoad = true;
      sendMail({
        email: this.form.email,
        code: this.form.code,
        browserId: this.browserId,
      })
        .then((res) => {
          this.$notify({
            title: res.message,
            type: "success",
          });
          this.btnCodeLoading = true;
          this.btnCodeLoad = false;
          this.timer = setInterval(() => {
            this.times--;
            if (this.times == 0) {
              this.times = 60;
              this.btnCodeLoading = false;
              clearInterval(this.timer);
            }
          }, 1000);
        })
        .catch(() => {
          this.btnCodeLoad = false;
          this.getCode();
        });
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-16 21:38:05
     * @Fn: 登录
     */
    async handleLogin() {
      this.$refs.form.validate((valid) => {
        const user = {
          emailCode: this.form.emailCode,
          email: this.form.email,
          browserId: this.browserId,
          uuid: this.uuid,
        };
        if (valid) {
          this.btnLoading = true;
          if (this.isChangeEmail) {
            this.bindingEmail(user);
          } else {
            this.loginByEmail(user);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     * 首次登录绑定邮箱
     */
    bindingEmail(user) {
      postUsersChangeEmail({
        email: user.email,
        emailCode: user.emailCode,
        userno: this.$store.getters.user.userno,
      })
        .then((res) => {
          this.$notify({
            title: "邮箱绑定成功",
            type: "success",
          });
          this.btnLoading = false;
          if (this.isInit) {
            this.$emit("init");
          } else {
            this.loginByEmail(user);
          }
        })
        .catch((err) => {
          this.btnLoading = false;
          console.log(err);
        });
    },

    /**
     * 通过邮箱登录
     */
    loginByEmail(user) {
      // 首次登录开启全屏登录蒙层
      if (this.isChangeEmail) {
        this.fullscreenLoading = true;
      }

      this.$store
        .dispatch("LoginByEmail", user)
        .then((res) => {
          this.btnLoading = false;
          this.$router.push({ path: "/" });
          this.fullscreenLoading = false;
        })
        .catch((err) => {
          this.btnLoading = false;
          this.fullscreenLoading = false;
          this.getCode();
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
