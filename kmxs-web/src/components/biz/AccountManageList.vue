<template>
  <div>
    <!--工具栏-->

    <div class="head-container crud-opts">
      <slot name="left" />
      <div class="crud-opts-left">
        <!-- 搜索 -->
        <el-input
          v-model="query.value"
          clearable
          placeholder="输入搜索内容"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select
          v-model="query.type"
          clearable
          placeholder="类型"
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in queryTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <slot name="right" />
      <div class="crud-opts-right">
        <template>
          <el-button
            v-permission="permission.approvalAdd"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="toAppleyApproval()"
            >申请临开账号</el-button
          >
        </template>
      </div>

      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="crud.loading"
      :data="crud.data"
      size="small"
      style="width: 100%"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('id')" prop="id" label="ID" />
      <el-table-column
        v-if="columns.visible('account')"
        prop="account"
        label="临开账号"
      />
      <el-table-column
        v-if="columns.visible('accountName')"
        prop="accountName"
        label="临开账号姓名"
      />
      <el-table-column
        v-if="columns.visible('originAccount')"
        prop="originAccount"
        label="发起人账号"
      />
      <el-table-column
        v-if="columns.visible('originName')"
        prop="originName"
        label="发起人姓名"
      />
      <!-- <el-table-column v-if="columns.visible('status')" prop="status" label="状态：1已启用、0已禁用、-1待启用" /> -->
      <el-table-column label="用户状态" align="left" prop="status" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '1'">已启用</span>
          <span v-else-if="scope.row.status === '0'">已禁用</span>
          <span v-else-if="scope.row.status === '-1'" class="render-class2"
            >待启用</span
          >
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="启用时间" /> -->
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        width="150"
        prop="expireTime"
        label="启用日期"
      >
        <template slot-scope="scope">
          <span>{{ $utils.parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="columns.visible('approvalNumber')"
        sortable
        width="120"
        prop="approvalNumber"
        label="审批单号"
      />
      <!-- <el-table-column v-if="columns.visible('expireTime')" prop="expireTime" label="到期时间" /> -->
      <el-table-column
        :show-overflow-tooltip="true"
        sortable
        width="150"
        prop="expireTime"
        label="过期日期"
      >
        <template slot-scope="scope">
          <span>{{ $utils.parseTime(scope.row.expireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-permission="['admin', 'accountManage:edit', 'accountManage:del']"
        label="操作"
        width="150px"
        align="center"
      >
        <template slot-scope="scope">
          <udOperation :data="scope.row" :permission="permission" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudAccountManage from "@http/mnt/accountManage";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import rrOperation from "@crud/RR.operation";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import pagination from "@crud/Pagination";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "accountManagement",
  url: "api/accountManage",
  sort: "id,desc",
  crudMethod: { ...crudAccountManage },
});
const defaultForm = {
  id: null,
  account: null,
  accountName: null,
  originAccount: null,
  originName: null,
  status: null,
  createTime: null,
  approvalNumber: null,
  expireTime: null,
};
export default {
  name: "AccountManage",
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ["admin", "accountManage:add"],
        edit: ["admin", "accountManage:edit"],
        del: ["admin", "accountManage:del"],
      },
      rules: {},
      queryTypeOptions: [
        { key: "id", display_name: "ID" },
        { key: "account", display_name: "临开账号" },
        { key: "originName", display_name: "临开账号姓名" },
        { key: "originAccount", display_name: "发起人账号" },
        { key: "originName", display_name: "发起人姓名" },
        { key: "status", display_name: "状态：1已启用、0已禁用、-1待启用" },
        { key: "approvalNumber", display_name: "审批单号" },
      ],
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query;
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value;
      }
      return true;
    },

    toAppleyApproval() {
      this.$router.push({
        path: "/workbench/account/accountApprovalEdit",
        query: { bizAction: "3" },
      });
    },
  },
};
</script>

<style scoped>
</style>
