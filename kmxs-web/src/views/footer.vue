<!--
 * @Author: Songjq
 * @Date: 2022-01-18 21:31:53
 * @Desscription: 页脚版权信息
-->
<template>
  <div v-if="$store.state.settings.showFooter" id="el-login-footer">
    <span v-html="$store.state.settings.footerTxt" />
    <span> ⋅ </span>
    <a href="http://www.beian.miit.gov.cn" target="_blank">{{
      $store.state.settings.caseNumber
    }}</a>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="scss" scoped>
#el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial, serif;
  font-size: 12px;
  letter-spacing: 1px;
}
</style>
