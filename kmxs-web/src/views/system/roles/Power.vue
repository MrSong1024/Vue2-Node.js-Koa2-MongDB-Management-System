<!--
 * @Author: Songjq
 * @Date: 2021-12-30 20:40:26
 * @Desscription: 
-->
<template>
  <el-drawer
    title="绑定权限"
    :visible.sync="drawerVisible"
    size="560px"
    @open="open"
    :wrapperClosable="false"
  >
    <div class="drawer__content">
      <div class="view-container">
        <org-tree
          ref="org-tree"
          nodekey="permission"
          :defaultExpandAll="true"
          :isShowCheckbox="true"
          :isLazy="false"
          :isAutoInit="false"
          :showSearch="false"
          inner-style="height:calc(100vh - 110px);padding-top:0px;"
          load-style="height: 100%;"
          :defaultCheckedKeys="defaultCheckedKeys"
          @getCheckedKeys="getCheckedKeys"
        />
      </div>
      <div slot="footer" class="drawer-footer">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submit"
          >确定</el-button
        >
      </div>
    </div>
  </el-drawer>
</template>

<script>
import publice from "@/mixins/publice.js";
import { postRolePerms } from "@http/system/role.js";
export default {
  name: "dns",
  mixins: [publice],
  components: {},
  props: ["roleId", "defaultCheckedKeys"],
  data() {
    return {
      drawerVisible: false,
      btnLoading: false,
      permissions: [], // 选中的权限
    };
  },
  methods: {
    // 打开抽屉
    open() {
      this.$nextTick(() => {
        this.$refs["org-tree"].init();
      });
    },

    // 树节点复选操作
    getCheckedKeys(prems) {
      this.permissions = prems;
    },

    // 提交数据
    submit() {
      this.btnLoading = true;
      postRolePerms({
        id: this.roleId,
        permissions: this.permissions,
      }).then((res) => {
        this.btnLoading = false;
        this.drawerVisible = false;
        this.$emit("init");
        this.$message.success("操作成功");
      });
    },
  },
};
</script>
