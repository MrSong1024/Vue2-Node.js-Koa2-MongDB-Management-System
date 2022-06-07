<template>
  <div class="introduction">
    <div class="introduction-content">
      <div class="head-container crud-opts">
        <slot name="left" />
        <div class="crud-opts-left">
          <!-- 搜索 -->
          <el-select
            v-model="queryParam.status"
            clearable
            size="mini"
            placeholder="状态"
            class="filter-item"
            style="width: 80px"
            @change="getUserData()"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <el-select
            v-model="queryParam.type"
            clearable
            size="mini"
            placeholder="类型"
            class="filter-item"
            style="width: 140px"
            @change="getUserData()"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </div>
      </div>
      <template v-if="crud.data.length">
        <el-table
          ref="table"
          :data="crud.data"
          style="width: 100%;"
          border
          :default-sort="{prop: 'id', order: 'descending'}"
          @sort-change="sortChange"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            width="80"
            prop="nickName"
            label="姓名"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            width="100"
            prop="employNum"
            label="账号"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            width="100"
            prop="phone"
            label="手机号"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            width="100"
            prop="employMail"
            label="邮箱"
          />
          <el-table-column
            label="用户类型"
            sortable="custom"
            align="left"
            width="110"
            prop="type"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type==='E1'">编内用户</span>
              <span v-else-if="scope.row.type==='O3'">IT供应商用户</span>
              <span v-else-if="scope.row.type==='E2'">编外用户</span>
              <span v-else-if="scope.row.type==='O2'">项目合作方用户</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            sortable="custom"
            prop="dept"
            label="部门"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.dept">{{ scope.row.dept.fullName }}</div>
              <div v-else />
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            width="130"
            prop="job"
            label="岗位"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.job">{{ scope.row.job.name }}</div>
              <div v-else />
            </template>
          </el-table-column>
          <el-table-column
            label="用户状态"
            align="left"
            sortable="custom"
            prop="status"
            width="100"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status==='1'">已启用</span>
              <span v-else-if="scope.row.status==='0'">已禁用</span>
              <span
                v-else-if="scope.row.status==='-1'"
                class="render-class2"
              >待启用</span>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <pagination />
      </template>
      <p v-if="!crud.data.length">暂无数据</p>
    </div>
  </div>
</template>

<script>
import pagination from "@crud/Pagination";
import crudUser from "@http/system/user";
import CRUD, { presenter, crud } from "@crud/crud";
const defaultCrud = CRUD({
  title: "组织查询用户查询",
  url: "api/users",
  crudMethod: { ...crudUser },
  queryOnPresenterCreated: false,
});
export default {
  name: "OrgUserLists",
  mixins: [presenter(defaultCrud), crud()],
  props: {
    deptId: {
      type: Number,
      default: null,
    },
    deptCode: {
      type: String,
      default: null,
    },
  },
  components: {
    pagination,
  },
  data() {
    return {
      showOverflowTooltip: true,
      queryParam: {
        sort: "status,desc",
        deptCode: this.$props.deptCode,
        deptIds: this.$props.deptId,
      },
      statusOptions: [
        { key: "1", display_name: "已启用" },
        { key: "0", display_name: "已禁用" },
        { key: "-1", display_name: "待启用" },
      ],
      typeOptions: [
        { key: "E1", display_name: "编内用户" },
        { key: "E2", display_name: "编外用户" },
        { key: "O2", display_name: "项目合作方用户" },
        { key: "O3", display_name: "IT供应商用户" },
      ],
    };
  },
  mounted() {
    this.getUserData();
  },

  methods: {
    getUserData() {
      this.crud.query = JSON.parse(JSON.stringify(this.queryParam));
      this.crud.toQuery();
    },
    // 升降序
    sortChange(obj) {
      if (["dept", "type", "status"].includes(obj.prop)) {
        let propVal = "";
        const propObj = {
          dept: "deptId",
          type: "type",
          status: "status",
        };
        for (const k in propObj) {
          if (obj.prop === k) {
            propVal = propObj[k];
            if (obj.order.includes("desc")) {
              this.queryParam.sort = propVal + "," + "desc";
              this.getUserData();
            } else {
              this.queryParam.sort = propVal + "," + "asc";
              this.getUserData();
            }
          }
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.introduction {
  font-size: 12px;
}
</style>
