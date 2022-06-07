<!--
 * @Author: Songjq
 * @Date: 2021-08-13 17:03:47
 * @Desscription:
-->
<template>
  <div class="kmxs-org-tree" :style="innerStyle">
    <div class="fixed head-container">
      <el-input
        v-if="showSearch"
        v-model="keyword"
        size="mini"
        clearable
        class="ui-mgb-10"
        placeholder="输入名称搜索"
        prefix-icon="el-icon-search"
        @keyup.enter.native="getNodeSearchInit"
        @clear="init"
      />
      <el-checkbox
        v-if="showCheck"
        v-model="isAllChildren"
        @change="setIsAllChildren"
        >包含子集</el-checkbox
      >
    </div>
    <div class="out_tree">
      <el-tree
        ref="deptTree"
        class="tree-content"
        :props="defaultProps"
        :node-key="nodekey"
        :expand-on-click-node="false"
        :default-expand-all="defaultExpandAll"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultExpandedKeys"
        :data="deptDatas"
        :show-checkbox="isShowCheckbox"
        check-strictly
        check-on-click-node
        highlight-current
        icon-class="el-icon-arrow-right"
        @node-click="handleNodeClick"
        @check-change="checkChange"
        @node-expand="
          (node) => {
            loadNodes(node);
          }
        "
      >
        <span slot-scope="{ node }" class="tree-node">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div
      v-if="loading"
      v-loading="loading"
      class="loading"
      :style="loadStyle"
    />
  </div>
</template>

<script>
import publice from "@/mixins/publice.js";
import { getMenusTree, getMenusTreeAll } from "@http/system/menu.js";
import { getDeptTree, getDeptTreeAll } from "@http/system/dept.js";
export default {
  name: "OrgTree",
  mixins: [publice],
  props: {
    // 数据类型
    requestUrlType: {
      type: String,
      default: "isMenus",
    },
    // 是否懒加载
    isLazy: {
      type: Boolean,
      default: true,
    },
    // 是否展开首行
    isOpenFirst: {
      type: Boolean,
      default: false,
    },
    // 展示检索
    showSearch: {
      type: Boolean,
      default: true,
    },
    // 默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 展示是否包含子集
    showCheck: {
      type: Boolean,
      default: false,
    },
    // 树节点是否可选
    isShowCheckbox: {
      type: Boolean,
      default: false,
    },
    // 默认勾选的节点数组
    defaultCheckedKeys: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 盒子的高度样式
    innerStyle: {
      type: String,
      default: "height:calc(100vh - 80px);padding-top:100px;",
    },
    // 加载蒙层的高度
    loadStyle: {
      type: String,
      default: "height: calc(100% - 60px);margin-top: 60px;",
    },
    // 是否自动初始化
    isAutoInit: {
      type: Boolean,
      default: true,
    },
    // 加载数据
    loadRightData: {
      type: Boolean,
      default: true,
    },
    // 关键节点
    nodekey: {
      type: String,
      default: "id",
    },
  },
  data() {
    return {
      keyword: "",
      // 包含子集
      isAllChildren: false, // 包含子集
      node: null,
      loading: false,
      // 节点数据
      deptDatas: [],
      // 默认展开的树节点
      defaultExpandedKeys: [],
      defaultProps: {
        label: "label",
        children: "children",
        isLeaf: "leaf",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isAutoInit) {
        this.init();
      }
    });
  },
  methods: {
    // 初始化树节点
    init() {
      this.keyword = "";
      this.deptDatas = [];
      this.defaultExpandedKeys = [];
      this.loadNodes({ id: "0" }); // 加载请求树节点的方法
    },

    // 加载树节点
    loadNodes(node) {
      if (this.isLazy) {
        this.getTreeLazy(node);
      } else {
        this.getTreeAll();
      }
    },

    // 懒加载方式获取树节点
    getTreeLazy(node) {
      this.loading = true;
      let typeUrlFn = "";
      switch (this.requestUrlType) {
        case "isMenus":
          typeUrlFn = getMenusTree;
          break;

        case "isDepts":
          typeUrlFn = getDeptTree;
          break;
      }

      // 请求接口，获取数据
      typeUrlFn({
        parentId: node.id,
        keyword: "",
      }).then((res) => {
        this.loading = false;
        if (!res || res.data.length === 0) {
          this.getChildrens(this.deptDatas, node.id, res.data);
          return;
        }

        // 解决节点展示空白的问题
        res.data.forEach((val) => {
          val.children = [{}];
          this.defaultExpandedKeys.forEach((value, index) => {
            if (value === val.id) {
              this.defaultExpandedKeys.splice(index, 1);
            }
          });
        });

        if (node.id === "0") {
          res.data.forEach((val) => {
            this.deptDatas.push(val);
          });
          this.loadNodes(res.data[0]);

          // 如果是树列表，就默认加载第一个节点数据
          if (this.isOpenFirst) {
            this.defaultExpandedKeys.push(res.data[0].id);
          }

          if (this.loadRightData) {
            this.handleNodeClick(res.data[0]);
          }
        } else {
          this.getChildrens(this.deptDatas, node.id, res.data);
        }
      });
    },

    // 获取所有树节点
    getTreeAll() {
      this.loading = true;
      let fn = null;
      switch (this.requestUrlType) {
        case "isMenus":
          fn = getMenusTreeAll();
          break;

        case "isDepts":
          fn = getDeptTreeAll();
          break;
      }

      fn.then((res) => {
        this.loading = false;
        this.deptDatas = res.data;
      });
    },

    // 通过父级ID 拼接组织树
    getChildrens(nodes, parentId, arr) {
      if (this.isShowCheckbox) {
        this.$nextTick(() => {
          this.$refs.deptTree.setCheckedNodes(this.defaultCheckedKeys);
        });
      }

      nodes.forEach((val) => {
        if (val.id === parentId) {
          val.children = arr;
        } else if (val.children && val.children.length > 0) {
          this.getChildrens(val.children, parentId, arr);
        }
      });
    },

    /**
     * 检索树节点
     *
     * @event Input#change
     */
    getNodeSearchInit() {
      const verObj = this.verifyKeyword(this.keyword);
      if (verObj.isNotGo) {
        this.$notify({
          title: verObj.tips,
          type: "warning",
        });
        return;
      }

      if (this.keyword === "") {
        this.init();
        return;
      }

      this.getNodeSearch();
    },

    // 通过关键字检索树节点
    getNodeSearch() {
      this.deptDatas = [];
      this.loading = true;
      this.defaultExpandedKeys = [];
      let typeUrlFn = "";
      switch (this.requestUrlType) {
        case "isMenus":
          typeUrlFn = getMenusTree;
          break;

        case "isDepts":
          typeUrlFn = getDeptTree;
          break;
      }

      typeUrlFn({
        parentId: "",
        keyword: this.keyword,
      }).then((res) => {
        this.loading = false;
        // 回填节点数据
        if (this.isShowCheckbox) {
          this.$nextTick(() => {
            this.$refs.deptTree.setCheckedNodes(this.defaultCheckedKeys);
          });
        }
        this.deptDatas = this.MINgetTreeData(res.data, "0");
      });
    },

    // 拼接组织树
    MINgetTreeData(data, id) {
      if (!Array.isArray(data)) {
        return [];
      }
      let newData = [];
      newData = data.filter((v) => v.parentId === id);
      data = data.filter((v) => v.parentId);
      this.MINgetChildren(newData, data);
      return newData;
    },

    MINgetChildren(parentData, data) {
      if (!data || data.length === 0) return;
      parentData.forEach((v) => {
        const newData = data.filter((v1) => {
          return v1.parentId === v.id;
        });
        if (newData && newData.length > 0) {
          v.children = newData;
          this.defaultExpandedKeys.push(v.id);
          this.MINgetChildren(newData, data);
        } else {
          v.children = [{}];
        }
      });
    },

    // 设置包含子集复选框
    setIsAllChildren(state) {
      this.$emit("setIsAllChildren", state);
    },

    // 切换部门
    handleNodeClick(data) {
      this.$emit("treeItemClick", data);
    },

    // 复选操作
    checkChange(data) {
      this.$emit("treeItemChecked", data);
      this.$emit("getCheckedKeys", this.$refs.deptTree.getCheckedKeys());
    },
  },
};
</script>

<style scoped lang="scss">
@import "~@/assets/styles/element-variables.scss";
.kmxs-org-tree {
  min-width: 200px;
  height: calc(100vh - 80px);
  position: relative;
  display: flex;
  padding-top: 100px;
  box-sizing: border-box;
  .loading {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }
  .tips {
    height: 18px;
    line-height: 18px;
    font-size: 10px;
    padding-left: 22px;
    color: #999999;
    span {
      padding: 0 6px 0 0;
    }
  }
  .fixed {
    top: 0;
    left: 0;
    width: 100%;
    position: absolute;
  }
  .out_tree {
    flex: 1;
    width: 100%;
    overflow-x: auto;
    .tree-content {
      overflow-y: auto;
      .tree-node {
        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          font-weight: 400;
          font-size: 10px;
          background: #f0f7fe;
          border-radius: 2px;
          color: $--color-primary;
        }
      }
    }
    .is-current {
      > .el-tree-node__content {
        .name {
          color: $--color-primary;
        }
      }
    }
  }
}

/deep/.el-checkbox__label {
  font-size: 12px;
}
.el-tree {
  min-width: 100%;
  display: inline-block !important;
}
</style>
