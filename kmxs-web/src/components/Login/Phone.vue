<!--
 * @Author: Songjq
 * @Date: 2022-05-02 22:58:54
 * @Desscription: 短信登录
-->
<template>
  <div class="login-form-body">
    <h3 class="login-title" v-if="isShowTitle">短信登录</h3>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="手机号"
          :disabled="isDisabled"
          @keyup.enter.native="handleLogin()"
          class="ui-flex-1"
          size="medium"
        >
          <svg-icon
            slot="prefix"
            icon-class="phone"
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
      <el-form-item prop="phoneCode">
        <div class="ui-flex">
          <el-input
            v-model="form.phoneCode"
            placeholder="输入6位数短信验证码"
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
import { sendPhoneCode } from "@http/sms/sms.js";
import { validatePhone } from "@/utils/validate.js";
import { postUsersChangePhone } from "@http/system/user.js";
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
    isChangePhone: {
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
        phone: "",
        code: "",
        phoneCode: "",
      },
      rules: {
        phone: [
          { required: true, trigger: "blur", message: "手机号为必填" },
          { trigger: "blur", validator: validatePhone },
        ],
        code: [
          { required: true, trigger: "blur", message: "图形验证码为必填" },
        ],
        phoneCode: [
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
    };
  },
  created() {
    this.form.phone = this.valueAlias;
  },
  methods: {
    /**
     * 获取动态验证码
     */
    stepOne() {
      if (!this.form.phone) {
        this.$notify({
          title: "请补全手机信息",
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
      sendPhoneCode({
        phone: this.form.phone,
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
          phoneCode: this.form.phoneCode,
          phone: this.form.phone,
          browserId: this.browserId,
          uuid: this.uuid,
        };
        if (valid) {
          this.btnLoading = true;
          if (this.isChangePhone) {
            this.bindingPhone(user);
          } else {
            this.loginByPhone(user);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     * 换绑手机号
     */
    bindingPhone(user) {
      postUsersChangePhone({
        phone: user.phone,
        phoneCode: user.phoneCode,
      })
        .then((res) => {
          this.$notify({
            title: "手机号绑定成功",
            type: "success",
          });
          this.btnLoading = false;
          if (this.isInit) {
            this.$emit("init");
          } else {
            this.loginByPhone(user);
          }
        })
        .catch((err) => {
          this.btnLoading = false;
          console.log(err);
        });
    },

    /**
     * 通过手机号登录
     */
    loginByPhone(user) {
      this.$store
        .dispatch("LoginByPhone", user)
        .then((res) => {
          this.btnLoading = false;
          this.$router.push({ path: "/" });
        })
        .catch((err) => {
          this.btnLoading = false;
          this.getCode();
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
