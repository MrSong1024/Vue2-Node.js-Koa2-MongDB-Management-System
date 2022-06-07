<template>
  <div class="supplier-container">
    <!--工具栏-->
    <div class="head-container crud-opts">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <slot name="left" />
      <div class="crud-opts-left">
        <!-- 搜索 -->
        <el-input
          v-model="query.blurry"
          clearable
          size="mini"
          placeholder="输入名称或者编码搜索"
          style="width: 180px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <span>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            icon="el-icon-search"
            @click="crud.toQuery"
            >搜索</el-button
          >
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            icon="el-icon-refresh-left"
            @click="crud.resetQuery()"
            >重置</el-button
          >
        </span>
      </div>
      <slot name="right" />
    </div>
    <!--表单组件-->
    <el-dialog
      :close-on-click-modal="false"
      :before-close="crud.cancelCU"
      :visible.sync="crud.status.cu > 0"
      :title="dialogTitle"
      width="500px"
      :append-to-body="true"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="100px"
      >
        <el-form-item label="公司名称" prop="name">
          <el-input v-model="form.name" style="width: 350px" />
        </el-form-item>
        <el-form-item label="公司编码" prop="permNumber">
          <el-input v-model="form.permNumber" style="width: 350px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button
          :loading="crud.btnLoading"
          type="primary"
          @click="crud.submitCU"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      size="small"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column width="60px">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            class="select-radio"
            :label="radioIdx(scope.row)"
            @change.native="radioSelChange(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns.visible('name')"
        prop="name"
        label="权限名称"
      />
      <el-table-column
        v-if="columns.visible('permNumber')"
        prop="permNumber"
        label="权限编码"
      />
    </el-table>
    <!--分页组件-->
    <pagination />
    <!--选择操作-->
    <div class="selector-oper">
      <el-button
        slot="reference"
        class="filter-item"
        type="primary"
        icon
        size="mini"
        @click="handleSelectSupplier()"
        >确认选择</el-button
      >
    </div>
  </div>
</template>

<script>
import crudSimItPerm from "@http/system/simItPerm";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import pagination from "@crud/Pagination";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "sso权限查询",
  url: "/api/simItPerm",
  sort: "id,desc",
  crudMethod: { ...crudSimItPerm },
  optShow: { add: true, edit: true, download: false },
});
const defaultForm = {
  id: null,
  name: null,
  supplierCode: null,
  permNumber: null,
  createTime: null,
  updateTime: null,
};
export default {
  name: "SsoAuthList",
  components: { pagination },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  props: {
    selectType: {
      type: String,
      default: "radio",
    },
    radioVal: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      permission: {
        add: ["admin", "itSupplier:add"],
      },
      rules: {
        name: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
      radio: this.radioVal,
      selectSupplier: {},
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
    radioIdx(row) {
      return row.name + "-" + row.id;
    },
    // 单选操作事件
    radioSelChange(data) {
      this.selectSupplier = data;
    },
    handleSelectSupplier() {
      this.radio = "";
      this.$emit("selectChange", this.selectSupplier);
    },
  },
};
</script>

<style scoped>
/deep/ .supplier-container .el-dialog__body {
  padding: 0px 20px 20px;
}
.selector-oper {
  padding: 10px 0;
  text-align: center;
}
</style>
