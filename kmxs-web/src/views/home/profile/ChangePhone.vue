<!--
 * @Author: Songjq
 * @Date: 2022-02-09 17:15:51
 * @Desscription: 换绑手机号
-->
<template>
  <el-dialog
    title="换绑手机号"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="420px"
    append-to-body
  >
    <Phone
      ref="phone"
      :isShowTitle="false"
      :isChangePhone="true"
      :isInit="true"
      btnShowText="验证并提交"
      @init="init"
    />
  </el-dialog>
</template>

<script>
import Phone from "@/components/Login/Phone.vue";
export default {
  components: { Phone },
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