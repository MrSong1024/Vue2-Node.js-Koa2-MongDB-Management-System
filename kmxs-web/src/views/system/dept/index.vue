<!--
 * @Author: Songjq
 * @Date: 2022-04-19 22:05:57
 * @Desscription: 部门管理
-->
<template>
  <div class="ui-flex">
    <div
      class="ui-mgt-10 tree-left"
      :style="isHide ? 'width:200px' : 'width:0px;margin-right:0px'"
    >
      <!-- requestUrlType="isDepts" -->
      <org-tree
        requestUrlType="isDepts"
        ref="org-tree"
        :showCheck="true"
        :isOpenFirst="true"
        :isLazy="true"
        inner-style="height:calc(100vh - 100px);padding-top:65px;"
        @setIsAllChildren="setIsAllChildren"
        @treeItemClick="handleTreeItemClick"
      ></org-tree>
    </div>
    <div class="ui-flex-1 kmxs-table">
      <right-list ref="right-list" @hideTree="toHideTree"></right-list>
    </div>
  </div>
</template>

<script>
import RightList from "./right-list.vue";
export default {
  name: "depts",
  mixins: [],
  dicts: [],
  components: {
    RightList,
  },
  data() {
    return {
      isHide: true,
      isAllChildren: false,
    };
  },

  methods: {
    // 设置包含子集
    setIsAllChildren(isAllChildren) {
      this.isAllChildren = isAllChildren;
    },

    // 隐藏树节点
    toHideTree(isHide) {
      this.isHide = isHide;
    },

    // 通过树节点获取列表数据
    handleTreeItemClick(data) {
      this.$nextTick(() => {
        this.$refs["right-list"].init(data, this.isAllChildren);
      });
    },

    // 初始化树节点
    treeInit() {
      this.$refs["org-tree"].init();
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-left {
  transition: all 0.3s;
  margin-right: 10px;
}
.kmxs-table {
  overflow: hidden;
  position: relative;
  z-index: 2;
}
</style>
