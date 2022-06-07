<!--
 * @Author: Songjq
 * @Date: 2022-04-27 21:25:46
 * @Desscription: 
-->
<template>
  <div class="head-container">
    <el-form ref="form" :model="form" label-width="180px" class="policy">
      <el-form-item label="密码最小长度">
        <div class="p-item">
          <el-input-number
            class="p-input"
            v-model="form.smallLength"
            :disabled="!isEdit"
            :min="0"
            :max="30"
          ></el-input-number
          >位<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="密码最大长度">
        <div class="p-item">
          <el-input-number
            class="p-input"
            v-model="form.bigLength"
            :disabled="!isEdit"
            :min="0"
            :max="30"
          ></el-input-number
          >位<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="密码最短使用期限">
        <div class="p-item">
          <el-input-number
            class="p-input"
            v-model="form.useShortTime"
            :disabled="!isEdit"
            :min="0"
            :max="30"
          ></el-input-number
          >天<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="密码最长使用期限">
        <div class="p-item">
          <el-input-number
            class="p-input"
            v-model="form.useLongTime"
            :disabled="!isEdit"
            :min="0"
            :max="90"
          ></el-input-number
          >天<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="重复的数字或字母">
        <div class="p-item">
          不可以包含
          <el-input-number
            class="p-input"
            v-model="form.repeatTimes"
            :disabled="!isEdit"
            :min="0"
            :max="30"
          ></el-input-number
          >个重复数字或字母<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="连续的数字">
        <div class="p-item">
          不可以包含
          <el-input-number
            class="p-input"
            v-model="form.continuityTimes"
            :disabled="!isEdit"
            :min="0"
            :max="30"
          ></el-input-number
          >个连续数字<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="强制密码历史">
        <div class="p-item">
          不可以使用之前
          <el-input-number
            class="p-input"
            v-model="form.useHistoryTimes"
            :disabled="!isEdit"
            :min="1"
            :max="30"
          ></el-input-number
          >次旧密码<span>(0:表示不限制)</span>
        </div>
      </el-form-item>
      <el-form-item label="密码必须包含">
        <el-checkbox-group v-model="form.isInclude" class="ui-pdl-6">
          <el-checkbox
            v-for="item in dict.sys_password_include"
            :key="item.value"
            :disabled="!isEdit"
            :label="item.value"
            >{{ item.label }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="禁用弱密码组合">
        <div class="p-item">
          <el-switch v-model="form.isWeak" :disabled="!isEdit"></el-switch>
          <span>不得以111111、123456、abcdef 等作为密码</span>
        </div>
      </el-form-item>
      <el-form-item label="账号名校验">
        <div class="p-item">
          <el-switch
            v-model="form.isIncludeAccount"
            :disabled="!isEdit"
          ></el-switch>
          <span>不能包含账号名（不区分大小写）</span>
        </div>
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
import { postPolicy, getPolicy } from "@http/login/policy.js";
import publice from "@/mixins/publice.js";
export default {
  name: "policy",
  mixins: [publice],
  dicts: ["sys_password_include"],
  components: {},
  data() {
    return {
      form: {
        bigLength: "",
        smallLength: "",
        isInclude: [],
        useShortTime: "",
        useLongTime: "",
        useHistoryTimes: "",
        repeatTimes: "",
        continuityTimes: "",
        isWeak: "",
        isIncludeAccount: "",
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
      getPolicy().then((res) => {
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
      let isIncludes = [];

      // 获取密码必须包含已选中的完整数据
      this.form.isInclude.forEach((val) => {
        this.dict.sys_password_include.forEach((v) => {
          if (val == v.value) {
            isIncludes.push(v);
          }
        });
      });

      postPolicy({ ...this.form, isIncludes })
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

