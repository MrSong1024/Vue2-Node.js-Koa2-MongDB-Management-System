<!--
 * @Author: Songjq
 * @Date: 2022-01-18 17:49:02
 * @Desscription: 
-->
<template>
  <div class="login">
    <div class="login-form" style="width: 560px">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
      >
        <el-steps
          :active="active"
          finish-status="success"
          simple
          class="ui-mgb-10 ui-mgt-10"
        >
          <el-step title="填写邮箱"></el-step>
          <el-step title="修改密码"></el-step>
          <el-step title="找回成功"></el-step>
        </el-steps>

        <el-form-item prop="email" v-if="active != 3">
          <el-input
            autocomplete="new-password"
            v-model="loginForm.email"
            type="text"
            prefix-icon="el-icon-message"
            placeholder="账户邮箱"
            size="medium"
            :readonly="active == 2"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="active == 2">
          <el-input
            autocomplete="new-password"
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            prefix-icon="el-icon-lock"
            placeholder="新密码"
            @keyup.enter.native="stepTwo"
            ><i
              slot="suffix"
              class="el-input__icon el-icon-view ui-cous"
              @click="showPassword = !showPassword"
            ></i
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass" v-if="active == 2">
          <el-input
            autocomplete="new-password"
            v-model="loginForm.checkPass"
            :type="showCheckPass ? 'text' : 'password'"
            prefix-icon="el-icon-lock"
            placeholder="确认新密码"
            size="medium"
            ><i
              slot="suffix"
              class="el-input__icon el-icon-view ui-cous"
              @click="showCheckPass = !showCheckPass"
            ></i
          ></el-input>
        </el-form-item>
        <el-form-item prop="emailCode" v-if="active == 2">
          <div class="ui-flex">
            <el-input
              v-model="loginForm.emailCode"
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
          </div>
        </el-form-item>
        <el-form-item prop="code" v-if="active != 3">
          <div class="ui-flex">
            <el-input
              v-model="loginForm.code"
              placeholder="验证码"
              @keyup.enter.native="nextFn"
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

        <div class="success-box" v-if="active == 3">
          <i class="el-icon-check"></i>
          <h4>修改成功</h4>
        </div>

        <el-form-item style="width: 100%">
          <!-- 找回密码 -->
          <el-button
            v-if="active == 1"
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click="stepOne"
          >
            找回密码
          </el-button>
          <!-- 修改密码 -->
          <el-button
            v-else-if="active == 2"
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click="stepTwo"
          >
            修改密码
          </el-button>
          <!-- 返回登录 -->
          <el-button
            v-else
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click="stepThree"
          >
            返回登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 切换页面按钮 -->
      <div class="login-form-footer" v-if="active != 3">
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
import Footer from "./footer.vue";
import { encrypt } from "@/utils/rsaEncrypt";
import { register, sendMail, forgetPwd } from "@http/login/login.js";
export default {
  name: "Login",
  mixins: [login],
  components: { Footer },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginForm.checkPass !== "") {
          this.$refs.loginForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      active: 1,
      codeUrl: "",
      cookiePass: "",
      loginForm: {
        email: "",
        password: "",
        checkPass: "",
        code: "",
        emailCode: "",
      },
      loginRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        code: [{ required: true, trigger: "blur", message: "验证码不能为空" }],
        emailCode: [
          { required: true, trigger: "blur", message: "邮箱验证码不能为空" },
        ],
      },
      loading: false,
      showPassword: false,
      showCheckPass: false,
    };
  },
  methods: {
    // 下一步
    nextFn() {
      if (this.active == 1) {
        this.stepOne();
      } else {
        this.stepTwo();
      }
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-16 22:56:35
     * @Fn: 注册服务 - 验证邮箱，发送验证码
     */
    stepOne() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          email: this.loginForm.email,
          code: this.loginForm.code,
          browserId: this.browserId,
        };
        if (valid) {
          this.loading = true;
          sendMail(user)
            .then((res) => {
              this.$notify({
                title: res.message,
                type: "success",
              });
              this.loading = false;
              this.active = 2;
              this.loginForm.code = "";
              this.getCode();
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 修改密码确认
    stepTwo() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          email: this.loginForm.email,
          emailCode: this.loginForm.emailCode,
          password: encrypt(this.loginForm.password),
          code: this.loginForm.code,
          browserId: this.browserId,
        };
        if (valid) {
          this.loading = true;
          forgetPwd(user)
            .then((res) => {
              this.$notify({
                title: res.message,
                type: "success",
              });
              this.loading = false;
              this.active = 3;
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        } else {
          return false;
        }
      });
    },

    // 密码修改成功，返回登录
    stepThree() {
      this.$router.push({
        path: "/login",
      });
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          email: this.loginForm.email,
          checkPass: this.loginForm.checkPass,
          password: encrypt(this.loginForm.password),
          code: this.loginForm.code,
          browserId: this.browserId,
        };
        if (valid) {
          this.loading = true;
          register(user)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
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

<style rel="stylesheet/scss" scoped lang="scss">
.success-box {
  text-align: center;
  font-size: 18px;
  color: #13ce66;
  padding: 20px 0 30px 0;
  i {
    font-size: 36px;
    border: 2px solid #13ce66;
    border-radius: 50%;
    padding: 6px;
  }
  h4 {
    padding-top: 15px;
  }
}
</style>
