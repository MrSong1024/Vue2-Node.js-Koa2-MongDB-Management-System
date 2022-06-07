<!--
 * @Author: Songjq
 * @Date: 2022-01-19 15:11:56
 * @Desscription: 换绑邮箱
-->
<template>
  <el-dialog
    title="换绑邮箱"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="420px"
    append-to-body
  >
    <Email
      ref="email"
      :isShowTitle="false"
      :isChangeEmail="true"
      :isInit="true"
      btnShowText="验证并提交"
      @init="init"
    />
  </el-dialog>
</template>

<script>
import Email from "@/components/Login/Email.vue";
export default {
  components: { Email },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    init() {
      this.dialogVisible = false;
      this.$emit("init");
    },
  },
};
</script>
<style scope lang="less"></style>