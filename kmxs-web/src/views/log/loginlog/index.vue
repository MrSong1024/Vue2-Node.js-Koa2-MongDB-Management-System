<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入登录地址">
        <template v-slot:left>
          <el-date-picker
            size="mini"
            v-model="dateTimes"
            type="daterange"
            range-separator=":"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="init()"
            :clearable="false"
          >
          </el-date-picker>
          <el-select
            size="mini"
            v-model="query.status"
            placeholder="登录状态"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-mgl-5 ui-w-100"
          >
            <el-option
              v-for="item in dict.sys_success_fail"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        style="width: 100%"
        border
        height="calc(100vh - 180px)"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="username" label="用户名称" min-width="100">
        </el-table-column>
        <el-table-column prop="userno" label="用户账号" min-width="100">
        </el-table-column>
        <el-table-column prop="role" label="角色" min-width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.role, role_types, "roleKey", "roleName")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="ipaddr" label="登录地址" width="260">
        </el-table-column>
        <el-table-column prop="location" label="登录地点" min-width="240">
        </el-table-column>
        <el-table-column prop="browser" label="浏览器" min-width="100">
        </el-table-column>
        <el-table-column prop="status" label="登录状态" min-width="100">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_success_fail"
            />
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="操作信息" min-width="150">
        </el-table-column>
        <el-table-column prop="loginTime" label="登录时间" min-width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.loginTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import LoginLog from "@http/log/login.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import { getRoleAll } from "@http/system/role.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "登录日志",
  url: "api/log/logininfor/all",
  crudMethod: { ...LoginLog },
  optShow: { user: true, del: true },
  queryOnPresenterCreated: false,
});

const defaultForm = {
  _id: null,
};

export default {
  name: "LoginLog",
  components: { pagination, crudOperation, udOperation, rrOperation },
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_success_fail"],
  data() {
    return {
      permission: {
        user: ["admin", "loginlog:user"],
        list: ["admin", "loginlog:list"],
        del: ["admin", "loginlog:del"],
      },
      dateTimes: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date(),
      ], // 最近一周
      role_types: [], // 角色
    };
  },
  created() {
    // 获取角色列表
    getRoleAll().then((res) => {
      this.role_types = res.data;
    });

    this.init();
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    init() {
      this.query.startTime = this.dateTimes[0];
      this.query.endTime = this.dateTimes[1];
      this.crud.toQuery();
    },
  },
};
</script>
<style lang="scss"></style>

