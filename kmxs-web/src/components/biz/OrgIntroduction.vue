<template>
  <div class="introduction">
    <p v-if="showTip">{{ tip }}</p>
    <div
      v-if="!showTip"
      class="introduction-content"
    >
      <el-row :gutter="10">
        <div
          v-for="(row, index) of labelList"
          :key="index"
          class="introduction-cont"
        >
          <div class="introduction-item">
            <div class="introduction-label">{{ row.label }}</div>
            <div class="introduction-value">
              <a :title="row.value">{{ row.value }}</a>
            </div>
          </div>
        </div>
        <el-row :gutter="10">
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <div class="introduction-item">
              <div class="introduction-label">组织所属职能:</div>
              <div class="introduction-value">
                <a :title="functions.toString()">{{ functions.toString() }}</a>
              </div>
              <template v-if="!functions.length">
                <el-button
                  v-if="byOwn"
                  size="mini"
                  type="text"
                  class="introduction-btn"
                  @click="handleAddFunction()"
                >设置职能</el-button>
              </template>
              <template v-if="functions.length">
                <el-button
                  v-if="byOwn"
                  size="mini"
                  type="text"
                  class="introduction-btn"
                  @click="handleEditFunction()"
                >设置职能</el-button>
              </template>
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <div class="admin-item">
              <div class="introduction-label">组织的管理员:</div>
              <div class="introduction-value">
                <a :title="admins.toString()"> {{ admins.toString() }}</a>
              </div>
              <el-button
                v-if="byOwn"
                size="mini"
                type="text"
                class="introduction-btn"
                @click="handleManage()"
              >设置管理员</el-button>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
    <!-- 弹出层 -->
    <el-dialog
      :append-to-body="true"
      title="设置管理员"
      :visible.sync="dialogTableVisible"
      @close="closeDialog"
    >
      <el-button
        style="margin-bottom: 10px;"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="addManage"
      >新增</el-button>
      <el-table :data="gridData">
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          property="username"
          label="管理员账号"
        />
        <el-table-column
          property="nickname"
          label="管理员姓名"
        />
        <el-table-column
          label="操作"
          width="130px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="deleteManage(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        width="1200px"
        height="100vh"
        title="新增管理员"
        :visible.sync="innerVisible"
        :append-to-body="true"
      >
        <user-selector
          ref="userSelector"
          :select-type="userListSelectType"
          :passed-in-param="userListQueryParam"
          @selectChange="handleUserSelChange"
        />
      </el-dialog>
    </el-dialog>
    <!-- 设置职能 -->
    <el-dialog
      :append-to-body="true"
      :title="functionTitle"
      :visible.sync="dialogFunctionVisible"
      @close="closeFunctionDialog"
    >
      <el-select
        v-model="funcNames"
        size="mini"
        placeholder="请选择职能"
        class="filter-item"
        multiple
        style="width: 100%"
        @change="selectFunc"
      >
        <el-option
          v-for="item in dict.jobdef_func"
          :key="item.value"
          :label="item.label"
          :value="item.label"
        />
      </el-select>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelFunction">取 消</el-button>
        <el-button
          type="primary"
          @click="saveFunction"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDeptFunction,
  getDeptAdmin,
  addDeptAdmin,
  delDeptAdmin,
  addDeptFunction,
  editDeptFunction,
} from "@http/system/dept";
import UserSelector from "@/components/biz/UserSelector";
export default {
  name: "OrgIntroduction",
  components: { UserSelector },
  props: {
    introduction: {
      type: Object,
      default: () => ({}),
    },
    admins: {
      type: Array,
      default: () => [],
    },
    functions: {
      type: Array,
      default: () => [],
    },
    catchFunction: {
      type: Array,
      default: () => [],
    },
    byOwn: {
      type: Boolean,
      default: false,
    },
  },
  dicts: ["jobdef_func"],
  data() {
    return {
      tip: " 请先选择组织",
      showTip: true,
      catchData: {},
      formatData: {},
      labelList: [],
      dialogTableVisible: false,
      gridData: [],
      innerVisible: false,
      userListQueryParam: { deptCode: "", deptId: undefined },
      userListSelectType: "radio",
      currentDeptId: null,
      selectUsername: null,
      selectUserId: null,
      dialogFunctionVisible: false,
      functionTitle: null,
      funcCode: null,
      funcName: null,
      funcStatus: null,
      funcId: null,
      catchDept: null,
      funcNames: null,
    };
  },
  watch: {
    introduction(n) {
      if (n.toString() !== "{}") {
        this.showTip = false;
        const catchData = JSON.parse(JSON.stringify(this.introduction));
        this.currentDeptId = catchData.id;
        this.catchDept = catchData;
        this.catchData = catchData;
        const labelList = [
          {
            label: "名称全路径:",
            value: catchData.fullName,
          },
          {
            label: "编码全路径:",
            value: catchData.fullCode,
          },
          {
            label: "组织名称:",
            value: catchData.name,
          },
          {
            label: "组织编码:",
            value: catchData.code,
          },
          {
            label: "负责人姓名:",
            value: catchData.leaderName,
          },
          {
            label: "负责人工号:",
            value: catchData.leaderEmployNum,
          },
          {
            label: "分管领导姓名:",
            value: catchData.sleaderName,
          },
          {
            label: "分管领导工号:",
            value: catchData.sleaderEmployNum,
          },
          {
            label: "组织类型:",
            value: catchData.hrType,
          },
          {
            label: "组织类型编码:",
            value: catchData.hrTypeCode,
          },
          {
            label: "层级分类:",
            value: catchData.hrLevel,
          },
          {
            label: "层级分类编码:",
            value: catchData.hrLevelCode,
          },
          {
            label: "层级类型:",
            value: catchData.stage === "1" ? "公司" : "部门",
          },
          {
            label: "层级级别:",
            value: catchData.stageLevel,
          },
        ];
        this.labelList = labelList;
      }
    },
  },
  mounted() {
    console.log("catchFunction", this.catchFunction);
  },
  methods: {
    // 新增 设置职能
    handleAddFunction() {
      this.dialogFunctionVisible = true;
      this.functionTitle = "配置职能";
      this.funcStatus = "add";
    },
    handleEditFunction() {
      this.funcNames = this.functions;
      this.dialogFunctionVisible = true;
      this.functionTitle = "修改职能";
      this.funcStatus = "edit";
    },
    // 设置管理
    handleManage() {
      this.currentDeptId = this.catchData.id;
      this.dialogTableVisible = true;
      this.getDeptAdmin(this.currentDeptId);
    },
    getDeptFunction(argument) {
      getDeptFunction({ deptId: argument }).then((res) => {
        this.functions = res.content.map((item) => {
          return item.funcName;
        });
        console.log("每个部门的职能数据：", this.functions);
      });
    },
    selectFunc(params) {
      console.log(255, params);
    },
    // 获取当前组织的管理员列表
    getDeptAdmin(argument) {
      getDeptAdmin({ deptId: argument }).then((res) => {
        const resData = res.content;
        resData.forEach((item) => {
          item.username = item.user && item.user.username;
          item.nickname = item.user && item.user.nickName;
        });
        this.gridData = resData;
        this.admins = resData.map((item) => {
          return item.user.nickName;
        });
      });
    },
    addManage() {
      this.innerVisible = true;
    },
    handleUserSelChange(params) {
      this.selectUsername = params[0].username;
      this.selectUserId = params[0].id;
      this.innerVisible = false;
      this.addDeptAdmin();
    },
    addDeptAdmin() {
      const params = {
        dept: {
          id: this.currentDeptId,
        },
        user: {
          username: this.selectUsername,
          id: this.selectUserId,
        },
      };
      addDeptAdmin(params).then((res) => {
        this.$message.success({
          message: "新增成功!",
          duration: 2000,
        });
        this.getDeptAdmin(this.currentDeptId);
      });
    },
    deleteManage(row) {
      this.$confirm("确定删除吗？")
        .then((_) => {
          delDeptAdmin([row.id]).then((res) => {
            this.$message.success({
              message: "删除成功!",
              duration: 2000,
            });
            this.getDeptAdmin(this.currentDeptId);
          });
        })
        .catch((_) => {});
    },
    closeDialog() {
      this.$parent.getDeptAdmin();
    },
    closeFunctionDialog() {
      this.$parent.getDeptFunction();
    },
    saveFunction() {
      if (this.funcStatus === "add") {
        this.addDeptFunction();
      } else {
        this.editDeptFunction();
      }
    },
    cancelFunction() {
      this.dialogFunctionVisible = false;
      this.funcCode = null;
      this.funcName = null;
      this.funcNames = null;
    },
    addDeptFunction() {
      const functions = [];
      this.funcNames.forEach((item) => {
        this.dict.jobdef_func.forEach((jobDef) => {
          if (item === jobDef.label) {
            functions.push({
              dept: JSON.parse(JSON.stringify(this.catchDept)),
              funcCode: jobDef.value,
              funcName: jobDef.label,
            });
          }
        });
      });
      const newParams = {
        functions: functions,
      };
      addDeptFunction(newParams).then((res) => {
        this.$message.success({
          message: "新增所属职能成功!",
          duration: 2000,
        });
        console.log(332, res);
        this.cancelFunction();
        this.getDeptFunction(this.currentDeptId);
      });
    },
    editDeptFunction() {
      const functions = [];
      this.funcNames.forEach((item) => {
        this.dict.jobdef_func.forEach((jobDef) => {
          if (item === jobDef.label) {
            functions.push({
              dept: JSON.parse(JSON.stringify(this.catchDept)),
              funcCode: jobDef.value,
              funcName: jobDef.label,
            });
          }
        });
      });
      this.catchFunction.forEach((func) => {
        console.log(374, func.id, func.funcName);
        functions.forEach((jobDef, index) => {
          if (func.funcName === jobDef.funcName) {
            functions[index].id = func.id;
          }
        });
      });
      const newParams = {
        functions: functions,
      };
      console.log("修改所属职能字段>>>", newParams);
      editDeptFunction(newParams).then((res) => {
        this.$message.success({
          message: "修改所属职能成功!",
          duration: 2000,
        });
        this.cancelFunction();
        this.getDeptFunction(this.currentDeptId);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.introduction {
  font-size: 12px;
  .introduction-content {
    .introduction-cont {
      width: 50%;
      display: inline-block;
    }
    .introduction-item,
    .admin-item {
      display: flex;
      color: #303133;
      line-height: 28px;
    }
    .introduction-item {
      height: 28px;
    }
    .introduction-label {
      flex-basis: 120px;
      width: 120px;
      margin-right: 10px;
      text-align: right;
      user-select: auto;
    }
    .introduction-value {
      flex: 1;
      overflow: hidden !important;
      text-overflow: ellipsis;
      white-space: nowrap;
      /*user-select: auto;*/
    }
    .introduction-btn {
      height: 28px;
      padding: 0;
    }
    .admin-list {
      flex: 1;
    }
  }
}
</style>
