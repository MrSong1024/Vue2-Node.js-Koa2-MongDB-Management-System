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
            placeholder="操作状态"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-mgl-5 ui-w-120"
          >
            <el-option
              v-for="item in dict.handel_options"
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

      <!-- 详细 -->
      <detial ref="detial" />

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
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="username" label="用户名称" min-width="100">
        </el-table-column>
        <el-table-column prop="userno" label="操作人员" min-width="100">
        </el-table-column>
        <el-table-column prop="shortUrl" label="操作链接" min-width="100">
          <template slot-scope="scope">
            <a :href="'http://' + scope.row.shortUrl" target="blank">
              {{ scope.row.shortUrl }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="ipaddr" label="操作地址" width="160">
        </el-table-column>
        <el-table-column prop="location" label="操作地点" width="160">
        </el-table-column>
        <el-table-column prop="method" label="请求方式" min-width="100">
        </el-table-column>
        <el-table-column prop="desc" label="操作描述" min-width="160">
        </el-table-column>
        <el-table-column prop="status" label="操作状态" min-width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == '200' ? 'success' : 'danger'">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作日期" width="160">
          <template slot-scope="scope">
            {{ parseTime(scope.row.date) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="detialFn(scope.row)"
              v-permission="permission.detial"
              >详细</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import Operation from "@http/log/operation.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import detial from "./detial.vue";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "操作日志",
  url: "api/log/operLog/all",
  crudMethod: { ...Operation },
  optShow: { user: true, del: true },
  queryOnPresenterCreated: false,
});

const defaultForm = {
  _id: null,
};

export default {
  name: "Operation",
  components: { detial, pagination, crudOperation, udOperation, rrOperation },
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["handel_options"],
  data() {
    return {
      permission: {
        user: ["admin", "operlog:user"],
        list: ["admin", "operlog:list"],
        detial: ["admin", "operlog:detial"],
        del: ["admin", "operlog:del"],
      },
      dateTimes: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date(),
      ], // 最近一周
    };
  },
  created() {
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

    /**
     * @Author: Songjq
     * @Date: 2021-12-24 12:52:36
     * @Fn: 查看详细
     */
    detialFn(row) {
      this.$refs.detial.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.detial.init(row);
      });
    },
  },
};
</script>
<style lang="scss"></style>

