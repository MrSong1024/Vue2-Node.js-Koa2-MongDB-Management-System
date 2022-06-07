<!--
 * @Author: Songjq
 * @Date: 2021-08-04 17:11:15
 * @Desscription: 
-->
<template>
  <div>

  </div>
</template>

<script>
export default {
  name: "SSOLogin",
  data() {
    return {
      loading: false,
    };
  },
  created() {
    const code = this.$route.query.code;
    // this.$store.dispatch("SSOAuthorize", "/login");
    if (code) {
      // 单点登录授权
      this.$store
        .dispatch("SSOLogin", code)
        .then(() => {
          this.loading = false;
          this.$router.push({
            path: sessionStorage.getItem("ssoPostRedirect") || "/",
          });
          sessionStorage.removeItem("ssoPostRedirect");
        })
        .catch(() => {
          this.loading = false;
        });
    } else {
      // window.location.href = "/";
      // 访问SSO Authorzie，重定向到SSO登录页面
      this.$store.dispatch("SSOAuthorize", this.$route.query.redirect || "/");
    }
  },
  methods: {},
};
</script>
