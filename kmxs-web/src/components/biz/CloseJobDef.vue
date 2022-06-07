<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="closeJobDefDialogVisible"
      width="50%"
      :append-to-body="true"
    >
      <div class="content">
        <div class="remark-content">
          <span class="label">备注: </span>
          <el-input
            v-model.trim="remark"
            class="remark-value"
            type="textarea"
            :rows="3"
            placeholder="请输入理由"
          />
        </div>
        <div class="remark-list">
          <h3>操作历史：</h3>
          <el-table
            border
            :data="records"
          >
            <el-table-column
              prop="remark"
              label="历史备注"
            />
            <el-table-column
              prop="lastModifyUserName"
              label="操作人"
              :show-overflow-tooltip="showOverflowTooltip"
              width="160"
            />
            <el-table-column
              label="操作时间"
              width="150"
            >
              <template slot-scope="scope">
                {{ timestampToDate(scope.row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作类型"
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.status === '0' ? '启用' : '关闭' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelCloseJobDef">取 消</el-button>
        <el-button
          type="primary"
          @click="saveCloseJobDef"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getJobDefsDeptRecord } from "@http/system/jobDef";
import { closeUsersJobs } from "@http/system/usersJobs";
export default {
  name: "CloseJobDef",
  props: {
    show: {
      type: Boolean,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    info: {
      type: Object,
      default: () => {},
    },
    dept: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      closeJobDefDialogVisible: this.$props.show,
      remark: null,
      records: [],
      showOverflowTooltip: true,
    };
  },
  mounted() {
    this.getRecords();
  },
  methods: {
    cancelCloseJobDef() {
      this.closeJobDefDialogVisible = false;
      this.remark = null;
    },
    saveCloseJobDef() {
      if (this.remark === null || this.remark === "") {
        this.$message.error({
          message: "请填写备注！",
          duration: 2000,
        });
        return false;
      }
      this.close();
    },
    close() {
      const userJob = this.$props.info;
      userJob.remark = this.remark;
      const list = [];
      list.push(userJob);
      const sendData = {
        jobDef: this.$props.info.jobDef,
        usersJobsList: list,
      };
      closeUsersJobs(JSON.stringify(sendData)).then((res) => {
        this.$message.success({
          message: "关闭岗位成功",
          duration: 2000,
        });
        this.cancelCloseJobDef();
        this.$parent.getUserData();
      });
    },
    getRecords() {
      const recordData = {
        deptId: this.dept.id,
        jobDefId: this.$props.info.jobDef.id,
      };
      getJobDefsDeptRecord(recordData).then((res) => {
        this.records = res.content.filter((item) => {
          return item.remark !== "" || item.remark !== null;
        });
      });
    },
  },
};
</script>

<style scoped>
.remark-content {
  position: relative;
  padding-bottom: 10px;
  border-bottom: 1px solid #efefef;
}
.remark-content .label {
  position: absolute;
  top: 8px;
  left: 0;
  width: 50px;
  display: inline-block;
  text-align: center;
}
.remark-value {
  margin-left: 50px;
  display: inline-block;
  width: calc(100% - 80px);
  line-height: 36px;
}
</style>
