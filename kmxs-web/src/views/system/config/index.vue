<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入参数名称 / 值">
        <template v-slot:left>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表单渲染-->
      <el-dialog
        destroy-on-close
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="660px"
        :append-to-body="true"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="参数名称" prop="configName">
            <el-input
              size="small"
              v-model="form.configName"
              placeholder="请输入参数名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="参数键名" prop="configKey">
            <el-input
              size="small"
              v-model="form.configKey"
              placeholder="请输入参数键名"
            ></el-input>
          </el-form-item>
          <el-form-item label="参数键值" prop="configValue">
            <el-input
              size="small"
              v-model="form.configValue"
              placeholder="请输入参数键值"
            ></el-input>
          </el-form-item>
          <el-form-item label="参数顺序" prop="orderNum">
            <el-input-number
              v-model="form.orderNum"
              placeholder="请输入参数顺序"
              controls-position="right"
              class="w-100"
              :min="1"
              :max="999"
              label="label"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template v-for="(item, idx) in dict.sys_disabled_status">
              <el-radio :key="idx" v-model="form.status" :label="item.value">{{
                item.label
              }}</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
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
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="configName" label="参数名称" min-width="180">
        </el-table-column>
        <el-table-column prop="configKey" label="参数键名" min-width="180">
        </el-table-column>
        <el-table-column prop="configValue" label="参数键值"> </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="参数顺序" width="100">
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            ></udOperation>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import Config from "@http/system/config.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "系统参数",
  url: "api/config/all",
  crudMethod: { ...Config },
  optShow: { add: true, status: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  _id: null,
  configName: "",
  configKey: "",
  configValue: "",
  orderNum: 999,
  status: "0",
  remark: "",
};

export default {
  name: "config",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_disabled_status"],
  components: { pagination, crudOperation, udOperation, rrOperation },
  data() {
    return {
      permission: {
        list: ["admin", "config:list"],
        add: ["admin", "config:add"],
        edit: ["admin", "config:edit"],
        del: ["admin", "config:del"],
        enable: ["admin", "config:enable"],
        disable: ["admin", "config:disable"],
      },
      rules: {
        configName: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
        configKey: [
          { required: true, message: "请输入参数键名", trigger: "blur" },
        ],
        configValue: [
          { required: true, message: "请输入参数键值", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
  },
};
</script>
<style lang="scss" scoped></style>

