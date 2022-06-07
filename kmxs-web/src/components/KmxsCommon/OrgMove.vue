<!--
 * @Author: Songjq
 * @Date: 2022-03-30 16:44:11
 * @Desscription: 移动组织节点
-->
<template>
  <el-drawer
    v-model="moveDialogVisible"
    :close-on-click-modal="false"
    :visible.sync="moveDialogVisible"
    title="移动节点"
    append-to-body
    destroy-on-close
    :size="viewWidth"
  >
    <div class="drawer__content">
      <div class="view-container inner-form">
        <bolm-org-tree
          ref="bolmTree"
          :is-auto-init="false"
          :request-url-type="requestUrlType"
          inner-style="height:calc(100vh - 160px);padding-top:40px;"
          load-style="height: calc(100% - 40px);margin-top: 40px;"
          @treeItemClick="handleNodeClick"
        />
      </div>
      <div slot="footer" class="view-footer">
        <el-button @click="moveDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitFn"
          >确认</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { postBaseOrgMove } from "@http/system/dept.js";
import { postBusinessOrgMove } from "@http/system/dept.js";
export default {
  name: "OrgMove",
  components: {},
  props: {
    requestUrlType: {
      type: String,
      default: "isBaseOrgTree",
    },
    selections: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      viewWidth: "689px",
      moveDialogVisible: false,
      bolmOrgParentId: "",
      btnLoading: false,
    };
  },

  methods: {
    // 初始化
    init(tagId = "") {
      this.$refs.bolmTree.init(tagId);
    },

    // 选中父节点
    handleNodeClick(row) {
      this.bolmOrgParentId = row.id;
    },

    // 移动确认操作
    submitFn() {
      this.btnLoading = true;
      const ids = [];
      let fn = null;
      if (this.requestUrlType === "isBusinessOrgTree") {
        // 业务组织
        this.selections.forEach((val) => {
          ids.push(val.businessOrgId);
        });
        fn = postBusinessOrgMove({
          businessOrgIds: ids,
          businessOrgParentId: this.bolmOrgParentId,
        });
      } else {
        // 基准组织
        this.selections.forEach((val) => {
          ids.push(val.bolmOrgId);
        });
        fn = postBaseOrgMove({
          bolmOrgIds: ids,
          bolmOrgParentId: this.bolmOrgParentId,
        });
      }

      // 提交数据
      fn.then(() => {
        this.moveDialogVisible = false;
        this.btnLoading = false;
        this.$emit("init");
        this.$notify({
          title: "保存成功",
          type: "success",
        });
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
