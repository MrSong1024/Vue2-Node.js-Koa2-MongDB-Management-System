<!--
 * @Author: Songjq
 * @Date: 2022-04-05 21:45:24
 * @Desscription: 
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "OaAppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    },
  },
  updated() {
    this.$emit("updated");
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
