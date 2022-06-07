<!--
 * @Author: Songjq
 * @Date: 2021-12-03 16:50:28
 * @Desscription: 更换密码
-->
<template>
  <el-dialog
    title="更换密码"
    :visible.sync="pawsswordVisible"
    :before-close="beforeClose"
    :close-on-click-modal="false"
    width="420px"
    append-to-body
  >
    <el-form
      ref="form"
      :model="form"
      label-width="90px"
    >
      <el-form-item
        prop="password"
        label="旧密码"
        :rules="[{ required: true, message: '请输入旧密码', trigger: 'blur' },{ max: 24, message: '长度不能超过24个字符', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="pass"
        label="新密码"
        :rules="[{ required: true, validator: passwordValidate, trigger: 'blur' }]"
      >
        <el-input
          v-model="form.pass"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        prop="checkPass"
        label="确认新密码"
        :rules="[{ required: true, validator: checkPassword, trigger: 'blur' }]"
      >
        <el-input
          v-model="form.checkPass"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="beforeClose">取消</el-button>
      <el-button
        type="primary"
        @click="submit"
        :loading="loading"
      >保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { encrypt } from "@/utils/rsaEncrypt";
import { postUsersChangePwd } from "@http/system/user.js";
export default {
  data() {
    return {
      pawsswordVisible: false, // 更换密码
      form: {
        password: "",
        pass: "",
        checkPass: "",
      },
      loading: false,
    };
  },
  methods: {
    // 密码校验
    passwordValidate(rule, value, callback) {
      if (!value || value == "") {
        callback(new Error("请输入密码"));
      }
      if (
        value &&
        value != "" &&
        !/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,30}$/.test(
          value
        )
      ) {
        callback(new Error("6-30位，包含大小写字母,数字至少三种"));
      } else {
        callback();
      }
    },
    checkPassword(rule, value, callback) {
      if (!value || value == "") {
        callback(new Error("请填写密码"));
      } else if (value !== this.form.pass) {
        callback(new Error("输入的密码不一致"));
      } else {
        callback();
      }
    },
    beforeClose() {
      this.$refs.form.resetFields();
      this.pawsswordVisible = false;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.loading) return;
          this.loading = true;
          postUsersChangePwd({
            password: encrypt(this.form.password),
            password2: encrypt(this.form.checkPass),
          })
            .then((res) => {
              this.$message.success("更换成功！");
              this.pawsswordVisible = false;
              setTimeout(() => {
                this.$emit("logout");
              }, 1000);
              this.loading = false;
            })
            .catch((err) => {
              this.loading = false;
              console.log(err);
            });
        }
      });
    },
  },
};
</script>
<style scope lang="less">
</style>