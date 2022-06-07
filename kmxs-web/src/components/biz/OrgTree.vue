<template>
  <div id="orgTree">
    <div class="head-container">
      <el-input
        v-model="deptName"
        clearable
        size="small"
        placeholder="输入名称搜索"
        prefix-icon="el-icon-search"
        class="filter-item"
      />
    </div>
    <el-tree
      ref="deptTree"
      class="tree-content"
      :data="deptDatas"
      :props="defaultProps"
      :expand-on-click-node="false"
      :default-expanded-keys="expandNodes"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { getDepts, getDeptByRole } from "@http/system/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "OrgTree",
  props: {
    byOwn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      deptName: "",
      depts: [],
      deptDatas: [],
      level: 3,
      expandNodes: [],
      defaultProps: { children: "children", label: "name" },
      permission: {
        list: ["admin", "dept:list"],
      },
      rules: {},
      isAllChildren: false, // 包含子集
    };
  },
  computed: {},
  watch: {
    deptName(val) {
      this.$refs.deptTree.filter(val);
    },
  },
  created() {
    this.$nextTick(() => {
      if (!this.$props.byOwn) {
        this.getDeptDatas();
      } else {
        this.getDeptByRole();
      }
    });
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
  },
  methods: {
    // 过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 获取部门数据
    getDeptDatas() {
      const sort = "id,desc";
      const params = { sort: sort };
      if (this.deptName) {
        params["name"] = this.deptName;
      }
      getDepts(params).then((res) => {
        this.deptDatas = res.content;
      });
    },
    // 获取弹窗内部门数据
    getDepts() {
      getDepts({ enabled: true }).then((res) => {
        this.expandNodes = res.content.length > 0 ? [res.content[0].id] : [];
        this.depts = res.content;
      });
    },
    getDeptByRole() {
      getDeptByRole().then((res) => {
        console.log(res);
        this.deptDatas = res.content;
      });
    },
    // 切换部门
    handleNodeClick(data) {
      this.$emit("treeItemClick", data);
    },
  },
};
</script>

<style scoped>
#orgTree {
  width: 200px;
  height: 70vh;
  overflow-y: auto;
  overflow-x: auto;
}
#orgTree .head-container .el-input {
  background: #f4f5f6;
  border: none;
}
#orgTree .head-container .el-input__inner {
  border: none !important;
}
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
</style>
