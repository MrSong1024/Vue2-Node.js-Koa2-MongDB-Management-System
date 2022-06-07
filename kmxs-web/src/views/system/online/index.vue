<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入登录地址">
        <template v-slot:left>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        height="calc(100vh - 180px)"
        border
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" fixed="left" width="40">
        </el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column
          prop="tokenId"
          label="会话编号"
          show-overflow-tooltip
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="userno"
          label="用户账号"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="username"
          label="用户姓名"
          min-width="120"
        ></el-table-column>
        <el-table-column prop="type" label="登录方式" min-width="120">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.type, dict.sys_login_type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="department"
          label="部门名称"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="ipaddr"
          label="登录IP"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="location"
          label="登录地点"
          show-overflow-tooltip
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="browser"
          label="浏览器"
          min-width="100"
        ></el-table-column>
        <el-table-column prop="exp" label="过期时间" min-width="180">
          <template slot-scope="scope">
            {{ $utils.parseTime(Number(scope.row.exp)) }}
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.loginTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
    <!--工具栏-->
  </div>
</template>

<script>
import Online from "@http/system/online.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "在线用户",
  url: "api/online/all",
  crudMethod: { ...Online },
  optShow: { del: true },
});

const defaultForm = {
  _id: null,
  // 会话编号
  tokenId: "",
  // 用户账号
  userno: "",
  // 用户姓名
  username: "",
  // 登录方式
  type: "",
  // 部门名称
  department: "",
  // 登录IP
  ipaddr: "",
  // 登录地点
  location: "",
  // 浏览器
  browser: "",
  // 过期时间
  exp: "",
};

export default {
  name: "onlines",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_login_type"],
  components: {
    pagination,
    crudOperation,
    udOperation,
    rrOperation,
  },
  data() {
    return {
      permission: {
        list: ["admin", "online:list"],
        del: ["admin", "online:del"],
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
