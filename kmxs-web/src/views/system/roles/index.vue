<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入角色名称 / 值">
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
        width="660px"
        :append-to-body="true"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input
              size="small"
              v-model="form.roleName"
              placeholder="请输入角色名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色值" prop="roleKey">
            <el-input
              size="small"
              v-model="form.roleKey"
              placeholder="请输入角色值"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色顺序" prop="orderNum">
            <el-input-number
              v-model="form.orderNum"
              placeholder="请输入角色顺序"
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
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="roleName" min-width="160" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleKey" width="150" label="角色值">
        </el-table-column>
        <el-table-column prop="orderNum" label="角色顺序"> </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="remark"
          label="备注"
          min-width="200"
        >
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission">
              <template v-slot:menu>
                <el-button
                  type="text"
                  @click="toPpower(scope.row)"
                  v-permission="permission.power"
                  >授权</el-button
                >
              </template>
            </udOperation>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>

    <!-- 绑定权限 -->
    <power
      ref="power"
      :roleId="crud.form._id"
      @init="crud.toQuery()"
      :defaultCheckedKeys="defaultCheckedKeys"
    />
  </div>
</template>

<script>
import Role from "@http/system/role.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import Power from "./Power.vue";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "角色",
  url: "api/role/all",
  crudMethod: { ...Role },
  optShow: { add: true, status: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  _id: null,
  roleName: "",
  roleKey: "",
  orderNum: 999,
  status: "0",
  remark: "",
};

export default {
  name: "roles",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_disabled_status"],
  components: { Power, pagination, crudOperation, udOperation, rrOperation },
  data() {
    return {
      permission: {
        list: ["admin", "roles:list"],
        add: ["admin", "roles:add"],
        edit: ["admin", "roles:edit"],
        del: ["admin", "roles:del"],
        power: ["admin", "roles:power"],
        enable: ["admin", "roles:enable"],
        disable: ["admin", "roles:disable"],
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleKey: [{ required: true, message: "请输入角色值", trigger: "blur" }],
      },
      isEdit: false,
      defaultCheckedKeys: [],
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    /**
     * 权限：授权操作
     *
     * @param{Object} row 当前行数据
     */
    toPpower(row) {
      let thsRow = JSON.parse(JSON.stringify(row));
      this.crud.form = thsRow;
      this.defaultCheckedKeys = thsRow.permissions;
      this.$refs.power.drawerVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
