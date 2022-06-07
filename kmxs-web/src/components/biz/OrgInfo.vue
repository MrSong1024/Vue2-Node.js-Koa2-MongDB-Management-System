<template>
  <div id="jobDefInfo">
    <div class="steps-container">
      <div class="status">新增</div>
      <div class="step-content">
        <ul>
          <li
            v-for="(item, index) of steps"
            :key="index"
            :class="{active:activeIndex==index}"
          >
            <span>{{ index + 1 === 1 ? '①' : '②' }}</span>{{ item }}
          </li>
        </ul>
      </div>
    </div>
    <!-- 选择岗位组 -->
    <el-card
      v-show="showJobDef"
      class="box-card"
      style="margin: 0 10px;"
    >
      <div slot="header">
        <span class="my-title">选择岗位组</span>
      </div>
      <AddOrgJobDef
        :mode="jobDefListMode"
        :passed-in-param="queryParam"
        :select-type="radio"
        @selectChange="handleJobDefChange"
      />
    </el-card>
    <!-- 基础数据的展示 -->
    <el-card
      v-show="showUser"
      class="box-card"
      style="margin: 0 10px;"
    >
      <div slot="header">
        <span class="my-title">选择用户</span>
      </div>
      <p
        v-if="addJobDef !== null"
        style="margin: 0 0 20px;"
      >岗位组名称: {{ addJobDef.name }}</p>
      <user-selector
        ref="userSelector"
        :show-button="userButton"
        :select-type="userListSelectType"
        :passed-in-param="userListQueryParam"
        :show-advanced-filter="userListAdvancedFilter"
        @selectChange="handleUserSelChange"
      />
    </el-card>
    <!--用户选择-->
    <!-- 底部按钮 -->
    <div
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        v-if="activeIndex===0"
        type="primary"
        size="mini"
        @click="next"
      >下一步
      </el-button>
      <el-button
        v-if="activeIndex===1"
        type="primary"
        size="mini"
        @click="prev"
      >上一步
      </el-button>
      <el-button
        v-if="activeIndex !==0"
        type="primary"
        size="mini"
        @click="saveJobDef"
      >保存
      </el-button>
      <el-button
        size="mini"
        @click="goBack"
      >取消
      </el-button>
    </div>
  </div>
</template>

<script>
import UserSelector from "@/components/biz/UserSelector";
import AddOrgJobDef from "@/components/biz/AddOrgJobDef";
import { editUsersJobs } from "@http/system/user";
export default {
  name: "OrgInfo",
  components: { UserSelector, AddOrgJobDef },
  props: {
    dept: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeIndex: 0,
      steps: ["选择岗位组", "设置组织人员"],
      showJobDef: true,
      showUser: false,
      selectUser: {},
      updateJobDef: false,
      jobDefListMode: "my",
      queryParam: {
        byOwner: true,
        orgLevelCodes: "1,2,3,4",
        stdTypeCodes: "1, 2",
        formCode: "CIFI",
        approvalStatus: "4",
        typeCode: "2",
      },
      radio: "radio",
      addJobDef: null,
      // 用户列表
      userListMode: "mgr",
      userListSelectType: "radio",
      userButton: false,
      currentSelectVal: "", // 当前选中的人员
      isSave: true,
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListAdvancedFilter: false,
      jobDefList: [],
      jobUser: null,
    };
  },
  methods: {
    // 上一步
    prev() {
      this.activeIndex--;
      this.$emit("moreWidth", "1100px");
      this.showJobDef = true;
      this.showUser = false;
    },
    // 下一步 提交form信息
    next() {
      if (this.addJobDef !== null) {
        this.activeIndex++;
        this.showJobDef = false;
        this.showUser = true;
      } else {
        this.$message.success({
          message: "请选择岗位",
          duration: 2000,
        });
        return;
      }
    },
    // 返回
    goBack() {
      this.$emit("click", false);
    },
    saveJobDef() {
      if (this.jobUser === null) {
        this.$message.error({
          message: "请选择用户",
          duration: 2000,
        });
      }
      if (this.addJobDef && this.jobUser) {
        const currentInfo = {
          dept: this.$props.dept,
          user: this.jobUser,
        };
        const formatJobsList = [];
        formatJobsList.push(currentInfo);
        const params = {
          jobDef: this.addJobDef,
          usersJobsList: formatJobsList,
        };
        // 修改人岗关系的接口
        editUsersJobs(JSON.stringify(params)).then((res) => {
          this.$message.success({
            message: "新增岗位成功",
            duration: 2000,
          });
          console.log("res>>>", params);
          this.$emit("change", params);
          this.$refs.userList.getUserData();
        });
      }
    },
    handleTreeItemClick(data) {
      this.userListQueryParam.deptCode = data.code;
      this.userListQueryParam.deptId = data.id;
      this.$refs.userList.getUserData();
    },
    handleUserSelChange(params) {
      const data = params[0];
      console.log("选中用户的：", data);
      this.jobUser = JSON.parse(JSON.stringify(data));
    },
    handleJobDefChange(e) {
      console.log("新增选中的岗位组数据", e);
      this.addJobDef = JSON.parse(JSON.stringify(e));
    },
  },
};
</script>

<style scoped>
.rule-container {
  width: 500px;
  border: 1px solid #efefef;
}
.rule-container .rule-title {
  font-size: 16px;
  color: #333;
  line-height: 36px;
  text-align: center;
  border-bottom: 1px solid #efefef;
}
.rule-container .rule-content p {
  font-size: 14px;
  margin: 0;
  line-height: 26px;
}
.rule-first,
.rule-second {
  display: flex;
  align-items: center;
}
.rule-first {
  border-bottom: 1px solid #efefef;
}
.rule-container .rule-content .rule-label {
  flex-basis: 20px;
  width: 20px;
  color: #333;
  padding: 0 6px;
  text-align: center;
}
.rule-bold {
  font-weight: bold;
  color: #333;
}
.rule-value {
  flex: 1;
  margin-left: 10px;
  border-left: 1px solid #efefef;
  padding: 6px;
}
.tip-content {
  padding-left: 10px;
  cursor: pointer;
}
#jobDefList .crud-opts {
  position: relative;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  padding: 0 10px 10px 0;
}
#jobDefList .crud-opts .crud-opts-right {
  margin-left: auto;
}
#jobDefInfo {
  padding-bottom: 65px;
  background: #f5f5f5;
}
.bottom-btn-groups {
  position: absolute;
  left: 0;
  bottom: 0px;
  z-index: 9999;
  width: 100%;
}
.status {
  flex-basis: 60px;
  width: 60px;
  height: 40px;
  padding-left: 20px;
  line-height: 40px;
  color: #fff;
}
.steps-container {
  display: flex;
  margin-bottom: 10px;
  background: #2761ff;
}
.step-content {
  margin: 0 auto;
}
.steps-container ul {
  padding-left: 0;
}
.steps-container ul li {
  list-style-type: none;
}
.steps-container ul {
  display: flex;
  height: 40px;
  margin: 0 auto;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.6);
}
.steps-container li {
  position: relative;
  margin-right: 10px;
}
.steps-container li span {
  display: inline-block;
  margin-top: -4px;
  padding-right: 6px;
  vertical-align: middle;
}
.steps-container li.active {
  position: relative;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.steps-container .active::before {
  position: absolute;
  bottom: 6px;
  left: 50%;
  display: block;
  width: 4px;
  height: 4px;
  overflow: hidden;
  content: "";
  background: #fff;
  border-radius: 50%;
}
.steps-container li:nth-child(1) {
  margin-right: 60px;
}
.steps-container li:nth-child(1)::after {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 1px;
  margin-top: 20px;
  margin-right: -45px;
  content: "";
  background: rgba(255, 255, 255, 0.6);
}
.auto-complete-container {
  position: relative;
}
.my-auto-complete {
  position: absolute;
  top: 30px;
  left: 0;
  z-index: 9999;
  box-sizing: border-box;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  padding: 0 0 0 10px;
  margin: 0;
  background: #fff;
  border: 1px solid #efefef;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.my-auto-complete li {
  list-style-type: none;
}
.base-container {
  height: calc(100vh - 142px);
  margin: 10px;
  background: #fff;
}
/deep/ .base-container label,
/deep/ .base-container .el-form-item--mini.el-form-item {
  font-weight: normal;
}
/deep/ .base-container .el-card__header {
  padding-bottom: 0px;
}
.btn-groups {
  margin-left: 30px;
}

.el-form-item_title {
  padding-left: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
/deep/ .user-list,
/deep/ .user-list .el-table .cell,
/deep/ .user-list .el-table__body-wrapper {
  overflow: visible;
}
.tree-container {
  overflow: visible;
}
.user-list .el-table {
  overflow: visible;
}
/deep/ .user-list .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
.user-list .title {
  padding-left: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.name_container {
  overflow: hidden !important;
}
.remark-content {
  position: relative;
  padding-bottom: 10px;
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
/deep/ .el-table__row td {
  height: 40px;
  line-height: 40px;
}
/deep/ .el-table__row td:nth-child(1) .cell {
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-dialog__wrapper {
  z-index: 9999 !important;
}
/deep/ .user-list {
  height: 360px;
  overflow-y: auto;
}
/deep/ .vue-treeselect__menu {
  z-index: 9999;
}
.hide {
  display: none;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
.more-text {
  width: 120px;
  overflow: hidden !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/*重置样式*/
/deep/ .base-container .el-form-item__label {
  padding-right: 0px;
  font-size: 14px;
  color: #333;
}
</style>
