<!--
 * @Author: Songjq
 * @Date: 2021-08-17 15:13:51
 * @Desscription:
-->
<template>
  <div class="head-container">
    <el-popover
      placement="bottom"
      trigger="click"
      :width="popoverWidth"
      :disabled="disabled"
    >
      <org-tree
        ref="org-tree"
        class="tree-content"
        :isAutoInit="true"
        :loadRightData="loadRightData"
        :isOpenFirst="false"
        :requestUrlType="requestUrlType"
        innerStyle="height:300px; padding-top:40px;"
        loadStyle="height:300px;"
        @treeItemClick="handleNodeClick"
      />
      <el-input
        size="small"
        slot="reference"
        v-model="itm[treeName]"
        :clearable="clearable"
        :placeholder="placeholder"
        :disabled="disabled"
        @clear="clearInputData"
      />
      <!-- 用于表单验证 -->
      <el-input v-show="false" v-model="deptName" />
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "SelectOrgTrees",
  props: {
    // 下拉提示语
    placeholder: {
      type: String,
      default: "输入名称搜索",
    },
    // 数据类型
    requestUrlType: {
      type: String,
      default: "isMenus",
    },
    // 初始化点击事件
    loadRightData: {
      type: Boolean,
      default: false,
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 展示清除按钮
    clearable: {
      type: Boolean,
      default: true,
    },
    // 触发表单校验
    deptName: {
      type: String,
      default: "",
    },
    // 浮框宽度
    popoverWidth: {
      type: String,
      default: "380",
    },
    // 当前操作数据
    itm: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 绑定的ID字段
    treeId: {
      type: String,
      default: "value",
    },
    // 绑定的别名字段
    treeName: {
      type: String,
      default: "valueAlias",
    },
  },
  data() {
    return {};
  },
  methods: {
    init() {
      this.$refs["org-tree"].init();
    },
    /**
     * 清除下拉数据
     */
    clearInputData() {
      this.$set(this.itm, this.treeName, "");
      this.$set(this.itm, this.treeId, "");
    },

    /**
     * 切换下拉数据
     */
    handleNodeClick(data) {
      this.$set(this.itm, this.treeName, data.label);
      this.$set(this.itm, this.treeId, data.id);
      this.$emit("changeOrgName", data);
      this.$emit("changeSelect");
    },
  },
};
</script>

<style scoped lang="scss">
.head-container {
  position: relative;
  padding-bottom: 0;
  .el-input {
    border: none;
  }
}
.tree-content {
  height: 260px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>
