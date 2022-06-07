<!--
 * @Author: Songjq
 * @Date: 2022-04-27 21:25:46
 * @Desscription: 
-->
<template>
  <div class="head-container">
    <el-form ref="form" :model="form" label-width="180px" class="ui-mgt-30">
      <el-form-item label="新设备登录">
        <el-switch v-model="form.isRemote" :disabled="!isEdit"></el-switch>
      </el-form-item>
      <el-form-item label="新设备通知">
        <el-switch v-model="form.isLoginNotice" :disabled="!isEdit"></el-switch>
      </el-form-item>
      <el-form-item label="新设备通知方式">
        <el-radio-group v-model="form.noticeType">
          <el-radio
            :label="item.value"
            v-for="item in dict.sys_login_notice_type"
            :key="item.value"
            :disabled="!isEdit"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item label="新设备二次认证">
        <el-switch v-model="form.isSecondAuth" :disabled="!isEdit"></el-switch>
      </el-form-item>
      <el-form-item label="新设备二次认证方式">
        <el-checkbox-group v-model="form.isSecondAuthType">
          <el-checkbox
            :label="item.value"
            name="type"
            v-for="item in dict.sys_auth_type"
            :key="item.value"
            :disabled="!isEdit || item.status == '1'"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="新设备认证时间">
        <div class="ui-flex ui-items-center" style="color: #666666">
          连续
          <el-input-number
            class="ui-w-100 ui-mgl-5 ui-mgr-5"
            v-model="form.authTime"
            :disabled="!isEdit"
            controls-position="right"
            :min="1"
            :max="30"
            placeholder="天"
          ></el-input-number
          >天未登录，重置为新设备
        </div>
      </el-form-item>
      <el-form-item label="多设备同时在线">
        <el-switch v-model="form.onceOnline" :disabled="!isEdit"></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="isEdit = true" v-if="!isEdit"
          >编辑</el-button
        >
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="toSubmitFn()"
          v-if="isEdit"
          >保存</el-button
        >
        <el-button @click="toResetFn()" v-if="isEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { postRemote, getRemote } from "@http/login/remote.js";
import publice from "@/mixins/publice.js";
export default {
  name: "remote",
  mixins: [publice],
  dicts: ["sys_login_notice_type", "sys_auth_type"],
  components: {},
  data() {
    return {
      form: {
        isRemote: false,
        isLoginNotice: false,
        noticeType: "",
        isSecondAuth: false,
        isSecondAuthType: [],
        authTime: "",
        onceOnline: false,
      },
      btnLoading: false,
      isEdit: false,
    };
  },
  created() {
    // 获取详情
    this.getDetailFn();
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailFn() {
      getRemote().then((res) => {
        if (res.data) {
          this.form = res.data;
        }
      });
    },
    /**
     * 提交表单
     */
    toSubmitFn() {
      this.btnLoading = true;
      postRemote(this.form)
        .then((res) => {
          this.$notify({
            title: "操作成功",
            type: "success",
          });
          this.toResetFn();
          this.btnLoading = false;
        })
        .catch((err) => {
          this.btnLoading = false;
        });
    },

    /**
     * 重置表单
     */
    toResetFn() {
      this.getDetailFn();
      this.isEdit = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>

