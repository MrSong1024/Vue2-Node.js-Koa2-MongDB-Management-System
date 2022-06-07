<template>
  <div class="view-container">
    <el-card class="box-card">
      <!--查看 岗位组基础信息-->
      <div class="base-info my-title">{{ jobDef.name }}({{ jobDef.code }})</div>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >层级：</label>
            <label class="el-form-item__content">{{ jobDef.orgLevelName }}</label>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >职能：</label>
            <label class="el-form-item__content">{{ jobDef.funcName }}</label>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >职能编码：</label>
            <label class="el-form-item__content">{{ jobDef.funcCode }}</label>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="6"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >岗位组性质：</label>
            <label class="el-form-item__content"> {{ jobDef.stdTypeCode === '1' ? '通用岗(一岗多人)' : '专用岗(一岗一人)' }}</label>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="16"
          :lg="16"
          :xl="12"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >业务系统：</label>
            <label class="el-form-item__content line-text-more">
              <el-popover
                class="my-popover"
                placement="top-start"
                :content="jobDef.bizSys"
                trigger="hover"
              >
                <div
                  slot="reference"
                  class="ellipsis-class"
                >{{ jobDef.bizSys }}</div>
              </el-popover>
            </label>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="24"
          :lg="24"
          :xl="24"
        >
          <div class="el-form-item el-form-item--mini">
            <label
              class="el-form-item__label"
              style="width:120px"
            >岗位组描述：</label>
            <label class="el-form-item__content line-text-more">
              <el-popover
                placement="top-start"
                :content="jobDef.remark"
                trigger="hover"
              >
                <div
                  slot="reference"
                  class="ellipsis-class"
                >{{ jobDef.remark }}</div>
              </el-popover>
            </label>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 岗位查询显示的列表 -->
    <div class="job-list">
      <el-card
        style="margin-top: 12px;"
        class="job-card"
      >
        <div slot="header">
          <span class="my-title">岗位人员</span>
          <el-button
            v-if="!showEditUserListBtn && jobDef.typeCode === '2'"
            style="float: right"
            @click="editUserList"
          >编辑</el-button>
          <el-button
            v-if="showEditUserListBtn"
            style="float: right"
            @click="addRow"
          >新增</el-button>
        </div>
        <div class="query-container">
          <el-table
            v-if="update"
            highlight-current-row
            :data="queryTableData"
            border
            style="width: 100%;margin-top:20px;"
          >
            <el-table-column type="index" />
            <el-table-column
              prop="deptName"
              label="岗位所在组织"
            >
              <template slot-scope="scope">
                <div
                  class="tree-container"
                  @click="clickRow(scope.row, scope.$index)"
                >
                  <template v-if="!editColOrgName">
                    {{ scope.row.deptName }}
                  </template>
                  <template v-else>
                    <template v-if="scope.row.selectOrgCode">
                      <treeselect
                        v-if="clickIndex === scope.$index"
                        v-model="scope.row.dept.id"
                        :max-height="200"
                        style="height: 26px;"
                        :options="options"
                        :clearable="false"
                        @select="selectFun"
                      >
                        <div
                          slot="value-label"
                          slot-scope="{ node }"
                        >{{ node.raw.fullName }}</div>
                      </treeselect>
                      <treeselect
                        v-if="clickIndex !== scope.$index"
                        :placeholder="scope.row.dept.fullName"
                        :max-height="200"
                        style="height: 26px;"
                        :options="[]"
                        :clearable="false"
                        @open="openTree(scope.$index)"
                      >
                        <div
                          slot="value-label"
                          slot-scope="{ node }"
                        >{{ node.raw.fullName }}</div>
                      </treeselect>
                    </template>
                    <template v-else>
                      <treeselect
                        style="height: 26px;"
                        placeholder="请选择组织"
                        :max-height="200"
                        :options="options"
                        :clearable="false"
                        @select="selectFun"
                      >
                        <div
                          slot="value-label"
                          slot-scope="{ node }"
                        >{{ node.raw.fullName }}</div>
                      </treeselect>
                    </template>
                  </template>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="deptCode"
              width="120"
              label="组织编号"
            />
            <el-table-column
              prop="nickname"
              label="员工姓名"
              width="160"
            >
              <template slot-scope="scope">
                <span v-if="!editNickName">{{ scope.row.nickname }}</span>
                <template v-else>
                  <div
                    class="userNameContainer"
                    @click="editSelectUserName(scope.$index, scope.row)"
                  >
                    <template v-if="scope.row.nickname">
                      <treeselect
                        class="holder-value"
                        :open-on-click="false"
                        style="height:26px;"
                        :clearable="false"
                        :options="[]"
                        :placeholder="scope.row.nickname"
                      />
                    </template>
                    <template v-else>
                      <treeselect
                        style="height:26px;"
                        :open-on-click="false"
                        :clearable="false"
                        :options="[]"
                        placeholder="请选择用户"
                      />
                    </template>
                  </div>
                </template>
              </template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="员工账号"
              width="120"
            />
            <el-table-column
              prop="jobCode"
              label="岗位编码"
              width="120"
            />
            <el-table-column
              v-if="showEditUserListBtn"
              label="操作"
              width="120px"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #2761FF;"
                  @click="deleteRow(scope.$index, queryTableData)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-dialog
        class="custom_el_dialog"
        width="1000px"
        height="100vh"
        :visible.sync="userSelDialog.show"
        :append-to-body="true"
        :title="userSelDialog.title"
      >
        <user-selector
          ref="userSelector"
          :select-type="userListSelectType"
          :passed-in-param="userListQueryParam"
          :show-advanced-filter="userListAdvancedFilter"
          @selectChange="handleRadioSelChange"
        />
      </el-dialog>
    </div>
    <div
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        v-if="showEditUserListBtn"
        type="primary"
        @click="saveUserJobs"
      >保存</el-button>
      <el-button
        v-if="showEditUserListBtn"
        @click="cancel"
      >取消</el-button>
      <el-button
        type="default"
        size="mini"
        @click="goBack()"
      >返回</el-button>
    </div>
  </div>
</template>

<script>
const lodash = require("lodash");
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { header } from "@crud/crud";
import { getJobDef } from "@http/system/jobDef";
import { getDepts } from "@http/system/dept";
import { getUsersJobsBySourceJobDefId, editUsersJobs } from "@http/system/user";
import UserSelector from "@/components/biz/UserSelector";
// crud交由presenter持有
export default {
  name: "JobDefApproval",
  components: { UserSelector, Treeselect },
  mixins: [header()],
  props: {
    viewMode: {
      type: String,
      default: "",
    },
    id: {
      type: Number,
      default: null,
    },
    fromCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      jobDef: {
        name: "",
        orgLevelCode: "",
        orgLevelName: "",
        funcCode: "",
        funcName: "",
        bizSys: "",
        stdTypeCode: "",
        stdTypeName: "",
        remark: "",
      },
      showOverflowTooltip: true,
      queryTableData: [],
      update: false,
      showEditUserListBtn: false,
      editColOrgName: false,
      editNickName: false,
      showEditDialog: false,
      userListMode: "mgr",
      userListSelectType: "radio",
      currentSelectVal: "", // 当前选中的人员
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListAdvancedFilter: false,
      userSelDialog: { title: "选择用户", show: false },
      selectUserIndex: "",
      noText: "暂无子部门数据！", // vue-treeselect 没有子部门显示的文字
      optionsList: [],
      catchList: [],
      clickIndex: null,
      fullCode: null,
      options: [],
      treeIndex: null,
    };
  },
  mounted() {
    // 获取用户所属的模块
    const source = localStorage.getItem("source");
    const parseSource = JSON.parse(source);
    const sourceCode = parseSource.dept.fullCode;
    this.fullCode = sourceCode;
    if (this.$props.id) {
      // 基本信息 和 人岗关系列表
      this.getJobDef();
      this.getUsersJobs();
    }
  },
  methods: {
    getDepts() {
      const params = {
        bizJobCreatedAllowed: true,
        bizJobEnabled: true,
        source: this.jobDef.formCode,
      };
      getDepts(params).then((res) => {
        console.log("272", res);
        this.optionsList = res.content;
      });
    },
    getJobDef() {
      getJobDef(this.$props.id)
        .then((res) => {
          this.jobDef = {
            id: res.id,
            name: res.name,
            orgLevelCode: res.orgLevelCode,
            orgLevelName: res.orgLevelName,
            funcCode: res.funcCode,
            funcName: res.funcName,
            bizSys: res.bizSys === null ? "" : res.bizSys,
            stdTypeCode: res.stdTypeCode,
            stdTypeName: res.stdTypeName,
            remark: res.remark,
            approval: JSON.parse(JSON.stringify(res.approval)),
          };
          this.jobDef = res;
          this.getDepts();
        })
        .catch((err) => {
          console.log(391, "工作台岗位信息", err);
        });
    },
    // 查看的时候 人岗关系
    getUsersJobs() {
      getUsersJobsBySourceJobDefId(this.$props.id)
        .then((res) => {
          // 人岗关系的编辑 数组里面的dept
          const resData = res.filter((items) => {
            return items.dept !== null;
          });
          resData.forEach((item) => {
            item.key = parseInt(Math.random() * 90000000000);
            if (!item.user) {
              // 没有用户
              item.nickname = "";
              item.employNum = "";
              item.username = "";
            } else {
              item.nickname = item.user.nickName;
              item.employNum = item.user.employNum;
              item.username = item.user.username;
            }
            item.deptName = item.dept.fullName;
            item.deptCode = item.dept.code;
            item.selectOrgCode = item.dept.code;
            item.selectOrgName = item.dept.name;
          });
          this.catchList = JSON.parse(JSON.stringify(resData));
          this.queryTableData = resData.sort((a, b) => {
            return a.deptName.localeCompare(b.deptName, "zh");
          });
          this.update = true;
        })
        .catch((err) => {
          console.log("工作台岗位信息: err", err);
        });
    },
    // 调整人岗关系列表
    editUserList() {
      console.log(316, "编辑");
      this.update = false;
      this.showEditUserListBtn = !this.showEditUserListBtn;
      this.editColOrgName = true;
      this.editNickName = true;
      this.update = true;
    },
    openTree(index) {
      console.log("当前点击的索引：", index);
      this.clickIndex = index;
      this.options = this.optionsList;
    },
    goBack() {
      this.$emit("click", false);
      this.$router.push({ path: "/workbench/jobDef" });
    },
    editSelectUserName(index, data) {
      this.selectUserName(index);
      // 需要传递的nickname scope.row.nickname
      this.currentSelectVal = data.nickname;
    },
    handleRadioSelChange(params) {
      const data = params[0];
      this.$set(
        this.$data.queryTableData[this.selectUserIndex],
        "nickname",
        data.nickName
      );
      this.$set(
        this.$data.queryTableData[this.selectUserIndex],
        "employNum",
        data.employNum
      );
      this.$set(
        this.$data.queryTableData[this.selectUserIndex],
        "username",
        data.username
      );
      this.$set(this.$data.queryTableData[this.selectUserIndex], "user", data);
      this.userSelDialog.show = false;
    },
    // 点击用户选择
    selectUserName(index) {
      // 显示用户选择列表
      this.userSelDialog.show = true;
      this.selectUserIndex = index;
    },
    clickRow(val, index) {
      this.clickIndex = index;
    },
    // 点击部门搜索对应的岗位
    selectFun(data) {
      this.$set(
        this.$data.queryTableData[this.clickIndex],
        "selectOrgCode",
        data.code
      );
      this.$set(
        this.$data.queryTableData[this.clickIndex],
        "deptCode",
        data.code
      );
      this.$set(
        this.$data.queryTableData[this.clickIndex],
        "selectOrgName",
        data.name
      );
      this.$set(this.$data.queryTableData[this.clickIndex], "dept", data);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 新增人岗关系
    addRow() {
      const len = this.queryTableData.length;
      const index = len - 1;
      const user = {
        dept: {
          children: null,
        },
        user: {},
      };
      this.queryTableData.splice(index + 1, 0, user);
      this.options = this.optionsList;
    },
    saveUserJobs() {
      let addList = []; // 新增加的数据
      let delList = []; // 删除的数据
      const changeList = []; // 改变的数据
      const oldChangeList = []; // 旧的改变的数据
      const catchList = this.catchList;
      const newList = this.queryTableData;
      addList = newList.filter((newItem) => {
        return !newItem.key;
      });
      delList = catchList.filter((catchItem) => {
        return newList.every((newItem) => {
          return catchItem.key !== newItem.key;
        });
      });
      delList.forEach((item) => {
        item.status = "N";
      });
      console.log("删除的数据：", delList);
      for (let i = 0; i < catchList.length; i++) {
        for (let j = 0; j < newList.length; j++) {
          if (
            catchList[i].key === newList[j].key &&
            !lodash.isEqual(catchList[i], newList[j])
          ) {
            oldChangeList.push(JSON.parse(JSON.stringify(catchList[i])));
            changeList.push(JSON.parse(JSON.stringify(newList[j])));
            break;
          }
        }
      }
      const postDataList = [...addList, ...delList, ...changeList];
      const usersJobsList = Array.from(new Set(postDataList));
      const result = usersJobsList.some((item) => {
        if (JSON.stringify(item.user) === "{}" || item.user === null) {
          return true;
        }
      });
      if (result) {
        this.$message.error({
          message: "调整人岗关系, 组织和人员缺一不可!",
          duration: 2000,
        });
        return false;
      }
      if (usersJobsList.length === 0) {
        this.showEditUserListBtn = !this.showEditUserListBtn;
        return;
      }
      const params = {
        jobDef: this.jobDef,
        usersJobsList: usersJobsList,
      };
      console.log(1530, "编辑提交的数据：", params);
      // 修改人岗关系的接口
      editUsersJobs(JSON.stringify(params)).then((res) => {
        this.$message.success({
          message: "修改人岗关系成功",
          duration: 2000,
        });
        this.cancel();
      });
    },
    cancel() {
      this.showEditUserListBtn = !this.showEditUserListBtn;
      this.editColOrgName = !this.editColOrgName;
      this.editNickName = !this.editNickName;
      this.getJobDef();
      this.getUsersJobs();
      this.update = !this.update;
      this.clickIndex = null;
      this.options = [];
    },
  },
};
</script>

<style scoped>
.el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.edit-base-container .el-form-item--mini.el-form-item {
  margin-bottom: 18px;
}
.line-text-more {
  width: calc(100% - 120px);
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ellipsis-class {
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .query-container .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
/deep/ .holder-value .vue-treeselect__placeholder {
  color: #333;
}

/deep/ .tree-container,
/deep/ .user-list,
/deep/ .job-list .job-card,
/deep/ .user-list .el-table,
/deep/ .job-list .el-table,
/deep/ .user-list .el-table .cell,
/deep/ .job-list .el-table .cell,
/deep/ .user-list .el-table__body-wrapper,
/deep/ .job-list .el-table__body-wrapper {
  overflow: visible;
}
</style>
