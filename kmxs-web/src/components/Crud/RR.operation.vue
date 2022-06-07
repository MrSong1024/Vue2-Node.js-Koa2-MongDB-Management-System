<!--
 * @Author: Songjq
 * @Date: 2022-04-05 21:45:23
 * @Desscription: 
-->
<!--搜索与重置-->
<template>
  <div class="crud-btns">
    <el-popover
      v-if="crud.optShow.screen"
      :popper-class="sideBar ? 'report-popover' : 'hideSlideBar'"
      placement="bottom-start"
      width="100%"
      trigger="click"
    >
      <div class="more-search-content">
        <slot name="screen" />
      </div>
      <el-button slot="reference" type="default" size="mini">
        高级筛选
      </el-button>
    </el-popover>
    <el-button
      size="mini"
      type="primary"
      icon="el-icon-search"
      @click="crud.toQuery()"
      >搜索</el-button
    >
    <el-button
      v-if="crud.optShow.reset"
      size="mini"
      type="default"
      icon="el-icon-refresh-left"
      @click="crud.resetQuery()"
      >重置</el-button
    >
  </div>
</template>
<script>
export default {
  props: {
    crud: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sideBar() {
      return this.$store.state.app.sidebar.opened;
    },
  },
};
</script>
