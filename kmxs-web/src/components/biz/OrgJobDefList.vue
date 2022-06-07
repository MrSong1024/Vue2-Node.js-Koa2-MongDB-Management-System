<template>
  <div class="introduction">
    <div class="introduction-content">
      <el-button
        v-if="byOwn"
        size="mini"
        type="text"
        style="float: right"
        @click="handleAddJobUser"
      >新增岗位</el-button>
      <template v-if="userList.length">
        <el-table
          ref="table"
          :data="userList"
          style="width: 100%;"
          :row-style="tableRowClassName"
          @expand-change="toggleRowExpansion"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="table-content">
                <!-- 业务岗&& 通用岗位 -->
                <el-button
                  v-if="props.row.originStdTypeCode === '1' && props.row.typeCode === '业务岗'"
                  size="mini"
                  type="text"
                  style="float: right"
                  @click="handleAdd"
                >新增岗位里的人员</el-button>
                <el-table
                  :data="props.row.subs"
                  border
                >
                  <el-table-column label="姓名">
                    <template slot-scope="scope">
                      {{ scope.row.user && scope.row.user.nickName }}
                    </template>
                  </el-table-column>
                  <el-table-column label="账号">
                    <template slot-scope="scope">
                      {{ scope.row.user && scope.row.user.employNum }}
                    </template>
                  </el-table-column>
                  <el-table-column label="岗位类型">
                    <template slot-scope="scope">
                      {{ scope.row.relType && scope.row.relType === '1' ? '主岗' : scope.row.relType === null ? '' : '兼岗' }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-if="byOwn"
                    label="操作"
                  >
                    <template slot-scope="scope">
                      <!-- 业务岗-->
                      <template v-if="props.row.typeCode === '业务岗'">
                        <!-- 删除 通用岗可以直接删除 专用岗；同一区域下 可以删除 最后一条关闭-->
                        <!-- jobDef.stdTypeCode === '1' 通用岗 2专用岗 0非标岗-->
                        <template v-if="['1', '0'].includes(props.row.originStdTypeCode)">
                          <el-button
                            size="mini"
                            type="text"
                            @click="handleDel(scope.row)"
                          >删除</el-button>
                          <el-button
                            size="mini"
                            type="text"
                            @click="handleEdit(scope.row)"
                          >修改</el-button>
                        </template>
                        <!-- 标准的一岗一人业务岗，岗位人员如果有多条支持删除操作（不是关闭），只有一条时则只能修改 -->
                        <template v-if="props.row.originStdTypeCode === '2'">
                          <template v-if="scope.row.user !== null && props.row.subs.filter((item) => {return item.jobCode !== null }).length > 1 ">
                            <el-button
                              size="mini"
                              type="text"
                              @click="handleDel(scope.row)"
                            >删除</el-button>
                          </template>
                          <template v-if="scope.row.user !== null && props.row.subs.filter((item) => {return item.jobCode !== null }).length === 1 ">
                            <el-button
                              size="mini"
                              type="text"
                              @click="handleEdit(scope.row)"
                            >
                              修改
                            </el-button>
                          </template>
                          <!--                          <el-button-->
                          <!--                            size="mini"-->
                          <!--                            type="text"-->
                          <!--                            @click="handleDisabled(scope.row)"-->
                          <!--                          >关闭</el-button>-->
                          <el-button
                            v-if="scope.row.user === null"
                            size="mini"
                            type="text"
                            @click="handleEdit(scope.row)"
                          >设置人员</el-button>
                        </template>
                      </template>
                      <el-button
                        v-if="scope.row.user === null && props.row.originStdTypeCode !== '0'"
                        size="mini"
                        type="text"
                        @click="handleNotification(scope.row, props.row.originTypeCode)"
                      >{{ props.row.typeCode === '业务岗' ? '通知用户申请' : '通知人力维护' }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="jobDefName"
            label="岗位组名称"
            width="220"
            :show-overflow-tooltip="showOverflowTooltip"
          />
          <el-table-column
            prop="jobDefCode"
            label="岗位组编码"
            width="220"
            :show-overflow-tooltip="showOverflowTooltip"
          />
          <el-table-column
            prop="typeCode"
            label="岗位组类型"
            width="82"
            :show-overflow-tooltip="showOverflowTooltip"
          />
          <el-table-column
            label="岗位性质"
            width="160"
            prop="stdTypeCode"
          />
          <el-table-column
            prop="deptName"
            label="岗位组织全路径"
            :show-overflow-tooltip="showOverflowTooltip"
          />
          <el-table-column
            prop="jobCode"
            width="82"
            label="岗位编码"
            :show-overflow-tooltip="showOverflowTooltip"
          />
          <el-table-column
            v-if="byOwn"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.originTypeCode === '2'"
                size="mini"
                type="text"
                @click="handleDisableJobDef(scope.row)"
              >禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
      </template>
      <p v-if="!userList.length">暂无数据</p>
    </div>
    <!-- 修改岗位中的人员 用户选择-->
    <el-dialog
      width="1000px"
      height="100vh"
      :visible.sync="userSelDialog.show"
      :append-to-body="true"
      :title="userSelDialog.title"
    >
      <user-selector
        v-if="updateUser"
        ref="userSelector"
        :select-type="userListSelectType"
        :passed-in-param="userListQueryParam"
        :show-advanced-filter="userListAdvancedFilter"
        @selectChange="handleUserSelChange"
      />
    </el-dialog>
    <!-- 关闭专用岗位弹框 -->
    <CloseJobDef
      v-if="update"
      ref="closeJobDef"
      :show="closeDialog.show"
      :title="closeDialog.title"
      :info="disableRow"
      :dept="catchDept"
    />
    <!-- 新建岗位 -->
    <el-drawer
      :append-to-body="true"
      :visible.sync="drawer"
      :with-header="false"
      :size="norWidth"
      :before-close="closeDrawer"
    >
      <div class="demo-drawer__content">
        <JobDefInfo
          v-if="hackReset"
          ref="userList"
          :dept="catchDept"
          @click="clickDrawer"
          @change="closeDrawer"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { editUsersJobs } from "@http/system/user";
import { notify } from "@http/system/job";
import {
  queryUsersJobList,
  disableOrgJobDef,
  getUsersJobByArea,
  closeUsersJobs,
} from "@http/system/usersJobs";
import UserSelector from "@/components/biz/UserSelector";
import CloseJobDef from "@/components/biz/CloseJobDef";
import JobDefInfo from "@/components/biz/OrgInfo";
export default {
  name: "OrgJobDefList",
  components: { UserSelector, CloseJobDef, JobDefInfo },
  props: {
    deptId: {
      type: Number,
      default: null,
    },
    dept: {
      type: Object,
      default: () => {},
    },
    byOwn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showOverflowTooltip: true,
      userList: [],
      rowStyleBg: {
        background: "#fdf5e6", // #fdf5e6
      },
      catchDept: null,
      userSelDialog: { title: "请选择被通知的用户", show: false },
      // 用户列表
      userListMode: "mgr",
      userListSelectType: "checkbox",
      updateUser: false,
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListAdvancedFilter: false,
      currentRow: null,
      editManage: null,
      usersJobsDto: null,
      closeDialog: { title: "关闭岗位", show: false },
      update: false,
      disableRow: null,
      addUserRow: null,
      jobDefVisible: false,
      updateJobDef: false,
      jobDefListMode: "my",
      queryParam: {
        byOwner: true,
        orgLevelCodes: "1,2,4",
        stdTypeCodes: "1, 2",
        formCode: "CIFI",
        approvalStatus: "4",
      },
      radio: "radio",
      addJobDef: null,
      addUserStatus: false,
      drawer: false,
      hackReset: false, // 强制刷新子组件
      norWidth: "1200px",
      viewWidth: "1200px",
    };
  },
  mounted() {
    this.getUserData();
    this.catchDept = JSON.parse(JSON.stringify(this.$props.dept));
    console.log("组织岗位：", this.catchDept);
  },
  methods: {
    getUserData() {
      this.getUserListById(this.deptId);
    },
    // 获取该组织下的人岗关系 userList
    getUserListById(argument) {
      let byOwner = null;
      if (this.$props.byOwn) {
        byOwner = false;
      } else {
        byOwner = true;
      }
      queryUsersJobList({
        deptId: argument,
        status: "Y",
        byOwner: byOwner,
      }).then((res) => {
        const resData = res;
        resData.forEach((item) => {
          item.jobDefName = item.jobDef !== null ? item.jobDef.name : "";
          item.jobCode = item.jobCode !== null ? item.jobCode : "";
        });
        const filterJobCodeNull = resData.filter((item) => {
          return item.jobCode === "";
        });
        const filterJobCodeVal = resData.filter((item) => {
          return item.jobCode !== "";
        });
        const concatArray = this.normalizeList(filterJobCodeNull).concat(
          this.normalizeList(filterJobCodeVal)
        );
        concatArray.forEach((items) => {
          items.subs.forEach((item) => {
            items.typeCode =
              item.jobDef !== null && item.jobDef.typeCode === "1"
                ? "行政岗"
                : item.jobDef !== null && item.jobDef.typeCode === "2"
                ? "业务岗"
                : "";
            items.jobDefCode = item.jobDef !== null ? item.jobDef.code : "";
            items.stdTypeCode =
              item.jobDef !== null && item.jobDef.stdTypeCode === "1"
                ? "通用岗位（一岗多人）"
                : item.jobDef !== null && item.jobDef.stdTypeCode === "2"
                ? "专用岗位（一岗一人）"
                : "";
            if (item.relType === "1") {
              items.relType = "主岗";
            } else if (item.relType === null) {
              items.relType = "";
            } else {
              items.relType = "兼岗";
            }
            items.deptName = item.dept.fullName;
            items.originStdTypeCode = item.jobDef.stdTypeCode;
            items.originTypeCode = item.jobDef.typeCode;
            items.jobDef = item.jobDef;
            items.jobCode = item.jobCode;
          });
        });
        this.userList = concatArray.sort((a, b) => {
          return a.jobDefName.localeCompare(b.jobDefName, "zh");
        });
      });
    },
    normalizeList(list) {
      const newItem = {};
      const newArr = [];
      list.forEach((item) => {
        // 根据某个键 组装数据
        newItem[item.jobDefName] || (newItem[item.jobDefName] = []);
        newItem[item.jobDefName] && newItem[item.jobDefName].push(item);
      });
      let i = 0;
      for (const obj in newItem) {
        newArr[i] = {
          jobDefName: obj,
          subs: newItem[obj],
        };
        i++;
      }
      return newArr;
    },
    tableRowClassName({ row }) {
      if (
        !row.subs.filter((item) => {
          return item.user !== null;
        }).length &&
        row.originStdTypeCode === "2"
      ) {
        return this.rowStyleBg;
      }
    },
    toggleRowExpansion(argument) {
      console.log("切换行的数据：", argument);
      this.addUserRow = argument.jobDef;
    },
    // 删除岗位中的人员
    handleDel(argument) {
      console.log("argument", argument);
      this.currentRow = argument;
      this.editManage = "delete";
      this.$confirm("确认删除该岗位的人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.editJob();
      });
    },
    // 修改岗位中的人员
    handleEdit(argument) {
      this.currentRow = argument;
      this.editManage = "edit";
      this.$confirm("确认修改该岗位的人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.selectUserName();
      });
    },
    // 新增岗位里面的人员 业务岗 通用岗
    handleAdd() {
      this.editManage = "addUser";
      this.$confirm("确认新增岗位的人员吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.selectUserName();
      });
    },
    // 提醒消息 1.行政岗 2 业务岗
    handleNotification(argument, typeCode) {
      this.usersJobsDto = JSON.parse(JSON.stringify(argument));
      this.editManage = "notify";
      const msg =
        typeCode === "2"
          ? '发送邮件及钉钉通知特定用户在"岗位自助"中申请'
          : "发送邮件及钉钉提示人力维护";
      this.$confirm(`确认${msg}吗?`, "通知", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.selectUserName();
      });
    },
    sendNotification(params) {
      notify(JSON.stringify(params)).then((res) => {
        this.$message.success({
          message: "提醒成功成功",
          duration: 2000,
        });
        console.log("提醒成功成功>>>", res);
      });
    },
    // 点击用户选择
    selectUserName() {
      // 显示用户选择列表
      if (this.editManage === "addUser") {
        this.userListSelectType = "checkbox";
      } else {
        this.userListSelectType = "radio";
      }
      this.updateUser = false;
      this.$nextTick(() => {
        this.updateUser = true;
        this.userSelDialog.show = true;
      });
    },
    handleUserSelChange(params) {
      const data = params;
      this.userSelDialog.show = false;
      console.log("选中用户的：", data);
      if (this.editManage === "notify") {
        const sendData = {
          user: params[0],
          usersJobsDto: this.usersJobsDto,
        };
        this.sendNotification(sendData);
      } else {
        this.editJob(data);
      }
    },
    // 修改人岗关系
    editJob(newUser) {
      const formatJobsList = [];
      if (this.editManage === "addUser") {
        newUser.forEach((item) => {
          formatJobsList.push({
            dept: this.catchDept,
            user: item,
          });
        });
      } else {
        const currentInfo = {
          id: this.currentRow.id,
          jobCode: this.currentRow.jobCode,
          status: this.editManage === "edit" ? "Y" : "N",
          dept: this.catchDept,
          user: this.editManage === "edit" ? newUser[0] : this.currentRow.user,
        };
        formatJobsList.push(currentInfo);
      }
      let jobDef = null;
      if (this.editManage === "addUser") {
        jobDef = this.addUserRow;
      } else {
        jobDef = this.currentRow.jobDef;
      }
      const params = {
        jobDef: jobDef,
        usersJobsList: formatJobsList,
      };
      console.log(436, params);
      // 修改人岗关系的接口
      editUsersJobs(JSON.stringify(params)).then((res) => {
        this.$message.success({
          message: "修改人岗关系成功",
          duration: 2000,
        });
        console.log("res>>>", params);
        this.getUserData();
      });
    },
    // 专用岗位最后一条关闭
    handleDisabled(argument) {
      this.disableRow = argument;
      this.update = false;
      console.log("专用岗位最后一条关闭", argument);
      this.$nextTick(() => {
        this.update = true;
        this.closeDialog.show = true;
      });
    },
    // 岗位禁用
    handleDisableJobDef(argument) {
      console.log("岗位禁用>>", argument);
      // 岗位是标准的一岗一人禁用需要判断 岗位对应的岗位组 在当前区域 是否只有一个岗位 是 则提示用户可能引起空岗
      // 并让用户确认进行 关闭操作
      if (argument.originStdTypeCode === "2") {
        const params = {
          deptId: this.catchDept.id,
          jobDefId: argument.jobDef.id,
        };
        getUsersJobByArea(params)
          .then((res) => {
            if (res.length > 1) {
              this.$confirm(`确认禁用岗位吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                const params = {
                  deptId: this.catchDept.id,
                  jobDef: argument.jobDef,
                };
                disableOrgJobDef(params)
                  .then((res) => {
                    console.log("禁用", res);
                    this.$message.success({
                      message: "禁用成功!",
                      duration: 2000,
                    });
                    this.getUserData();
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            } else {
              this.$confirm(`会引起空岗,确认禁用岗位吗?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }).then(() => {
                if (["2", "4"].includes(argument.jobDef.orgLevelCode)) {
                  const sendData = {
                    usersJobsList: res,
                    jobDef: argument.jobDef,
                  };
                  closeUsersJobs(JSON.stringify(sendData))
                    .then((res) => {
                      console.log("关闭", res);
                      this.$message.success({
                        message: "关闭成功!",
                        duration: 2000,
                      });
                      this.getUserData();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  const params = {
                    deptId: this.catchDept.id,
                    jobDef: argument.jobDef,
                  };
                  disableOrgJobDef(params)
                    .then((res) => {
                      console.log("禁用", res);
                      this.$message.success({
                        message: "禁用成功!",
                        duration: 2000,
                      });
                      this.getUserData();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.$confirm(`确认禁用岗位吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const params = {
            deptId: this.catchDept.id,
            jobDef: argument.jobDef,
          };
          disableOrgJobDef(params)
            .then((res) => {
              console.log("禁用", res);
              this.$message.success({
                message: "禁用成功!",
                duration: 2000,
              });
              this.getUserData();
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    },
    // 新增岗位
    handleAddJobUser() {
      this.$nextTick(() => {
        this.drawer = true;
        this.hackReset = true;
      });
    },
    clickDrawer(val) {
      this.drawer = val;
      this.hackReset = val;
    },
    closeDrawer() {
      this.drawer = false;
      this.hackReset = false;
    },
  },
};
</script>

<style scoped>
.table-content {
  margin: 10px 40px;
  /*border: 1px solid #efefef;*/
}
.table-content p {
  display: flex;
}
.title span {
  font-size: 13px;
  font-weight: bold;
}
.table-content .title,
.table-content p {
  /*padding-bottom: 6px;*/
  /*border-bottom: 1px solid #efefef;*/
}
.table-content p span {
  flex: 1;
  padding-left: 10px;
}

.table-content p:last-child,
.noData {
  border: none;
}
.main p.noData {
  padding-left: 10px;
}
.jobDef {
  margin: 10px 0;
}
/deep/ .el-dialog__body {
  padding: 16px;
}
/deep/ .el-drawer__body {
  overflow-y: auto;
  background: #f5f5f5;
}
/deep/ .el-drawer__header {
  margin-bottom: 0px;
  padding-top: 16px;
  padding-left: 0px;
  color: #fff;
  background: #2761ff;
}
.view-drawer-title .right-close {
  cursor: pointer;
}
/deep/ .demo-drawer__content {
  text-align: left;
}
</style>
