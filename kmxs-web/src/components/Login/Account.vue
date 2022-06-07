<!--
 * @Author: Songjq
 * @Date: 2022-05-02 22:58:54
 * @Desscription: 账号登录
-->
<template>
  <div class="login-form-body">
    <h3 class="login-title">账号登录</h3>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      label-position="left"
      label-width="0px"
    >
      <el-form-item prop="userno">
        <el-input
          autocomplete="new-password"
          v-model="loginForm.userno"
          type="text"
          prefix-icon="el-icon-user"
          placeholder="账号"
          size="medium"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          autocomplete="new-password"
          v-model="loginForm.password"
          :type="showPassword ? 'text' : 'password'"
          prefix-icon="el-icon-lock"
          placeholder="密码"
          size="medium"
          @keyup.enter.native="handleLogin()"
          ><i
            slot="suffix"
            class="el-input__icon el-icon-view ui-cous"
            @click="showPassword = !showPassword"
          ></i
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="ui-flex">
          <el-input
            v-model="loginForm.code"
            placeholder="验证码"
            @keyup.enter.native="handleLogin"
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
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%"
          size="medium"
          @click.native.prevent="handleLogin()"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import login from "@/mixins/login.js";
import { encrypt } from "@/utils/rsaEncrypt";
export default {
  name: "Login",
  mixins: [login],
  components: {},
  props: {},
  data() {
    return {
      loginForm: {
        userno: "",
        password: "",
        code: "",
      },
      loginRules: {
        userno: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [{ required: true, trigger: "blur", message: "验证码不能为空" }],
      },
      loading: false,
      codeUrl: "",
      showPassword: false,
    };
  },
  created() {},
  methods: {
    /**
     * @Author: Songjq
     * @Date: 2021-12-16 21:38:05
     * @Fn: 登录
     */
    async handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          ...this.loginForm,
          password: encrypt(this.loginForm.password),
          browserId: this.browserId,
          uuid: this.uuid,
        };
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", user)
            .then((res) => {
              this.loading = false;
              // 需要二次验证
              if (res.isSecondAuth) {
                this.$emit("setSecondAuthTypeOptions", res.data);
                this.$refs["secondAuth"].dialog = true;
                this.$nextTick(() => {
                  this.$refs["secondAuth"].init();
                });
              } else {
                // 无需二次验证，直接登录
                this.$router.push({ path: "/" });
              }
            })
            .catch((err) => {
              this.loading = false;
              this.getCode();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
