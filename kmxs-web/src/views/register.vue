<template>
  <div class="login">
    <div class="login-form">
      <div class="login-form-body">
        <h3 class="login-title">注册</h3>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
          <el-form-item prop="username">
            <el-input
              autocomplete="new-password"
              v-model="loginForm.username"
              type="text"
              prefix-icon="el-icon-user-solid"
              placeholder="用户名"
              size="medium"
            ></el-input>
          </el-form-item>
          <el-form-item prop="userno">
            <el-input
              autocomplete="new-password"
              v-model="loginForm.userno"
              type="text"
              prefix-icon="el-icon-user"
              placeholder="账号"
              size="medium"
            ></el-input>
          </el-form-item>
          <el-form-item prop="role">
            <el-select
              style="width: 100%"
              v-model="loginForm.role"
              placeholder="请选择角色"
              size="medium"
            >
              <el-option
                v-for="item in rolesOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              autocomplete="new-password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              prefix-icon="el-icon-lock"
              placeholder="密码"
              size="medium"
              @keyup.enter.native="handleLogin"
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
                <img :src="codeUrl" @click="getCode" />
              </div>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 切换页面按钮 -->
      <div class="login-form-footer">
        <div class="ui-flex-1"></div>
        <el-button size="medium" type="text" @click="login">
          返回登录
        </el-button>
      </div>
    </div>
    <!--  底部  -->
    <footer />
  </div>
</template>

<script>
import login from "@/mixins/login.js";
import { getRoleAlls } from "@http/system/role.js";
import Footer from "./footer.vue";
import { encrypt } from "@/utils/rsaEncrypt";
import { register } from "@http/login/login.js";
export default {
  name: "Login",
  mixins: [login],
  components: { Footer },
  data() {
    return {
      codeUrl: "",
      cookiePass: "",
      loginForm: {
        username: "",
        password: "",
        role: "",
        userno: "",
        code: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        userno: [{ required: true, trigger: "blur", message: "账号不能为空" }],
        role: [{ required: true, trigger: "change", message: "角色不能为空" }],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
        code: [{ required: true, trigger: "blur", message: "验证码不能为空" }],
      },
      loading: false,
      showPassword: false,
      rolesOptions: [],
    };
  },
  created() {
    // 获取角色列表
    getRoleAlls().then((res) => {
      this.rolesOptions = res.data;
    });
  },
  methods: {
    /**
     * @Author: Songjq
     * @Date: 2021-12-16 22:56:35
     * @Fn: 注册服务
     */
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          ...this.loginForm,
          browserId: this.browserId,
          password: encrypt(this.loginForm.password),
        };
        if (valid) {
          this.loading = true;
          register(user)
            .then((res) => {
              this.loading = false;
              this.$notify({
                title: res.message,
                type: "success",
              });
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch((err) => {
              console.log(err);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     * @Author: Songjq
     * @Date: 2022-01-18 10:11:06
     * @Fn: 登录
     */
    login() {
      this.$router.push({ path: this.redirect || "/" });
    },
  },
};
</script>
