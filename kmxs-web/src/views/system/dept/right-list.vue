<!--
 * @Author: Songjq
 * @Date: 2022-04-19 22:05:57
 * @Desscription: 部门管理
-->
<template>
  <!--工具栏-->
  <div class="head-container">
    <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
    <crudOperation :permission="permission" placeholder="请输入部门名称">
      <template v-slot:left>
        <rrOperation :crud="crud" />
      </template>
      <template v-slot:right></template>
    </crudOperation>

    <!--表单渲染-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="crud.status.title"
      width="680px"
      destroy-on-close
      :append-to-body="true"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="ui-flex ui-flex-wrap"
      >
        <el-form-item label="父级节点" prop="parentId" class="w-100">
          <select-org-trees
            treeId="parentId"
            treeName="parentName"
            requestUrlType="isDepts"
            popoverWidth="540"
            :itm="form"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName" class="w-50">
          <el-input
            size="small"
            v-model="form.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum" class="w-50">
          <el-input-number
            size="small"
            v-model="form.orderNum"
            placeholder="请输入部门顺序"
            controls-position="right"
            class="w-100"
            :min="1"
            :max="999"
            label="label"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="负责人" prop="leader" class="w-50">
          <el-input
            size="small"
            v-model="form.leader"
            placeholder="请输入负责人"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" class="w-50">
          <el-input
            size="small"
            v-model="form.phone"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" class="w-50">
          <el-input
            size="small"
            v-model="form.email"
            placeholder="请输入邮箱"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status" class="w-50">
          <template v-for="(item, idx) in dict.sys_disabled_status">
            <el-radio :key="idx" v-model="form.status" :label="item.value">{{
              item.label
            }}</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="w-100">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.btnLoading"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </span>
    </el-dialog>

    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      height="calc(100vh - 180px)"
      border
      default-expand-all
      @selection-change="crud.selectionChangeHandler"
      row-key="_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="deptName" label="部门名称" min-width="260">
      </el-table-column>
      <el-table-column prop="orderNum" label="部门顺序"> </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <disabled-tag
            :status="scope.row.status"
            :options="dict.sys_disabled_status"
          />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160">
        <template slot-scope="scope">
          {{ $utils.parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="60">
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission"></udOperation>
        </template>
      </el-table-column>
    </el-table>

    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import Dept from "@http/system/dept.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import IconSelect from "@/components/IconSelect";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "用户",
  url: "api/dept/all",
  crudMethod: { ...Dept },
  queryOnPresenterCreated: false,
  optShow: { status: true, add: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  parentId: 0,
  parentName: "",
  deptName: "",
  leader: "",
  phone: "",
  orderNum: 999,
  email: "",
  status: "0",
  remark: "",
};

export default {
  name: "dept",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_disabled_status"],
  components: {
    IconSelect,
    crudOperation,
    udOperation,
    rrOperation,
    pagination,
  },
  data() {
    return {
      permission: {
        list: ["admin", "dept:list"],
        add: ["admin", "dept:add"],
        edit: ["admin", "dept:edit"],
        del: ["admin", "dept:del"],
        enable: ["admin", "dept:enable"],
        disable: ["admin", "dept:disable"],
      },
      rules: {
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
        ],
      },
      isEdit: false,
    };
  },
  watch: {
    "query.keyword": {
      handler(val) {
        this.query.parentId = "";
        this.query.isAllChildren = false;
        if (!val && !this.query.status) {
          this.$emit("hideTree", true);
        } else {
          this.$emit("hideTree", false);
        }
      },
      deep: true,
    },

    "query.status": {
      handler(val) {
        this.query.parentId = "";
        this.query.isAllChildren = false;
        if (!val && !this.query.keyword) {
          this.$emit("hideTree", true);
        } else {
          this.$emit("hideTree", false);
        }
      },
      deep: true,
    },
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    // 手动初始化
    init(data, isAllChildren) {
      this.query.parentId = data.id;
      this.query.isAllChildren = isAllChildren;
      this.crud.toQuery();
    },
  },
};
</script>
<style lang="scss"></style>
