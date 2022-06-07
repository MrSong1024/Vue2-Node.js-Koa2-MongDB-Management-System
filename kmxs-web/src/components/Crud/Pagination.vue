<!--
 * @Author: Songjq
 * @Date: 2022-03-16 15:51:16
 * @Desscription: 分页组件
-->
<!--分页-->
<template>
  <div class="ui-flex">
    <div class="ui-flex-1" />
    <el-pagination
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      :page-sizes="pageSizes"
      style="margin-top: 8px"
      layout="total, prev, pager, next, sizes"
      @size-change="crud.sizeChangeHandler($event)"
      @current-change="crud.pageChangeHandler"
    />
  </div>
</template>
<script>
import { pagination } from "@crud/crud";
export default {
  mixins: [pagination()],
  data() {
    return {
      pageSizes: [10, 30, 50, 100, 200, 500],
    };
  },
};
</script>
