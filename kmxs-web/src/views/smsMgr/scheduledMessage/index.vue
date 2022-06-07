
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
        <el-table-column label="批次号" prop="resMsgid" min-width="160">
        </el-table-column>
        <el-table-column
          prop="phones"
          label="手机号码"
          show-overflow-tooltip
          min-width="160"
        >
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
        <el-table-column prop="unitPrice" label="短信费用（元）" width="130">
        </el-table-column>
        <el-table-column prop="templateType" label="消息类型" width="140">
          <template slot-scope="scope">
            {{
              $utils.getAlias(
                scope.row.templateType,
                dict.sys_sms_template_type
              )
            }}
          </template>
        </el-table-column>
        <el-table-column prop="timing" label="定时时间" sortable min-width="150"
          ><template slot-scope="scope">
            {{ $utils.parseTime(scope.row.timing) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="toSend(scope.row)"
              v-permission="permission.send"
              >手动发送</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import SendRecord from "@http/sms/sendRecord.js";
import { sendMessage } from "@http/sms/sms.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "定时短信",
  url: "api/sms/sendRecord/all",
  crudMethod: { ...SendRecord },
  optShow: { del: true, user: true },
  queryOnPresenterCreated: false,
});

const defaultForm = {
  _id: null,
};

export default {
  components: { pagination, crudOperation, udOperation, rrOperation },
  name: "Scheduled",
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
        user: ["admin", "scheduledMessage:user"],
        list: ["admin", "scheduledMessage:list"],
        del: ["admin", "scheduledMessage:del"],
        send: ["admin", "scheduledMessage:send"],
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
      this.query.isTiming = true;
      this.crud.toQuery();
    },

    /**
     * 手动发送
     *
     * @event Button#click
     * @params{Object} 当前数据
     */
    toSend(row) {
      row.isTiming = false;

      this.$confirm("此操作将直接发送当前短信, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 确认发送
          sendMessage(row)
            .then((res) => {
              this.$message.success(res.message);
              this.init();
            })
            .catch((err) => {
              this.init();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
