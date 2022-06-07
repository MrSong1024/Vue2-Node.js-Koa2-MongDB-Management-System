
<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation
        :permission="permission"
        placeholder="请输入手机号/消息内容/批次号"
      >
        <template v-slot:left>
          <el-select
            size="mini"
            v-model="query.status"
            placeholder="发送状态"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-w-120"
          >
            <el-option
              v-for="item in dict.sys_success_fail"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            size="mini"
            v-model="dateTimes"
            type="daterange"
            range-separator=":"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="init()"
            :clearable="false"
            class="ui-mgr-5"
          >
          </el-date-picker>
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
        <el-table-column fixed="left" type="selection" width="40">
        </el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column label="批次号" prop="resMsgid" min-width="130">
        </el-table-column>
        <el-table-column prop="fromNum" label="手机号码" min-width="110">
        </el-table-column>
        <el-table-column prop="templateType" label="消息类型" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(
                scope.row.templateType,
                dict.sys_sms_template_type
              )
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="smsContent"
          label="消息内容"
          show-overflow-tooltip
          min-width="400"
        >
        </el-table-column>
        <el-table-column prop="smsInfo" label="消息详情" min-width="150">
        </el-table-column>
        <el-table-column prop="unitPrice" label="短信价格（元）" width="120">
        </el-table-column>
        <el-table-column prop="status" label="发送状态" width="100">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_success_fail"
            />
          </template>
        </el-table-column>
        <el-table-column prop="smsCount" label="计费条数" width="80">
        </el-table-column>
        <el-table-column prop="operator" label="运营商" min-width="100">
        </el-table-column>
        <el-table-column prop="area" label="归属地" min-width="100">
        </el-table-column>
        <el-table-column prop="area_operator" label="号码详情" min-width="100">
        </el-table-column>
        <el-table-column prop="recvTime" label="接收时间" min-width="150">
          <template slot-scope="scope">
            {{ $utils.getStrTime(scope.row.recvTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="dateSent" label="发送时间" min-width="150">
          <template slot-scope="scope">
            {{ $utils.getStrTime(scope.row.dateSent) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import ReturnRecord from "@http/sms/returnRecord.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "发送回执",
  url: "api/sms/returnRecord/all",
  crudMethod: { ...ReturnRecord },
  optShow: { del: true, user: true },
  queryOnPresenterCreated: false,
});

const defaultForm = {
  _id: null,
};

export default {
  components: { pagination, crudOperation, udOperation, rrOperation },
  name: "ReturnRecord",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_success_fail", "sys_sms_template_type"],
  data() {
    return {
      permission: {
        user: ["admin", "returnRecord:user"],
        list: ["admin", "returnRecord:list"],
        del: ["admin", "returnRecord:del"],
      },
      dateTimes: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date(),
      ], // 最近一周
    };
  },
  created() {
    // 初始化页面数据
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
<style lang="scss" scoped></style>
