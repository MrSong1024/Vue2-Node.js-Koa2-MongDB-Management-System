<template>
  <div class="job-container">
    <!-- 选中的岗位信息列表 -->
    <div
      v-if="showSelectList"
      class="select-list"
    >
      <el-card
        v-for="(item, index) of selectList"
        :key="index"
        style="margin-bottom: 10px;"
      >
        <div class="select-item">
          <div class="item-left">
            <div class="select-title">
              {{ item.jobDef.name }}
            </div>
            <div class="select-desc">
              <el-tag
                v-if="item.jobDef.stdTypeCode === '1'"
                size="mini"
                style="color: #159AFF;"
              >通用岗位(一岗多人)</el-tag>
              <el-tag
                v-else-if="item.jobDef.stdTypeCode === '2'"
                size="mini"
              >专用岗位(一岗一人)</el-tag>
              <span>{{ item.deptName }}</span>
            </div>
          </div>
          <div
            class="item-delete"
            style="padding:10px;"
            @click="delSelect(index)"
          >
            <i class="el-icon-delete" />
          </div>
        </div>
      </el-card>
    </div>
    <div class="search-container">
      <el-card>
        <el-select
          v-model.trim="queryParam.blurry"
          style="width: 100%;"
          filterable
          remote
          size="medium"
          reserve-keyword
          placeholder="请输入岗位组名称"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="getUsersJob()"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-card>
    </div>
    <!-- 通用岗 -->
    <div
      v-if="showGeneralList"
      class="job-list"
    >
      <el-card>
        <el-table
          highlight-current-row
          :data="tableData"
          border
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" />
          <el-table-column
            prop="deptName"
            label="岗位所在组织"
          />
          <el-table-column
            prop="deptCode"
            label="组织编号"
          />
        </el-table>
      </el-card>
    </div>
    <!-- 专用岗 -->
    <div
      v-if="showUniqueList"
      class="job-list"
    >
      <el-card>
        <el-table
          highlight-current-row
          :data="tableData"
          border
          style="width: 100%"
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" />
          <el-table-column
            prop="deptName"
            label="岗位所在组织"
            width="220"
            :show-overflow-tooltip="showOverflowTooltip"
          />
          <el-table-column
            prop="deptCode"
            label="组织编号"
          />
          <el-table-column
            prop="nickname"
            label="员工姓名"
            width="120"
          />
          <el-table-column
            prop="username"
            label="员工账号"
            width="120"
          />
        </el-table>
      </el-card>
    </div>
    <div
      v-show="showBtnList"
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        type="primary"
        @click="saveJob"
      >确定</el-button>
      <el-button @click="cancelJob">取 消</el-button>
    </div>
  </div>
</template>

<script>
const lodash = require("lodash");
import {
  getUsersJob,
  addUsersJobs,
  queryJobDefList,
} from "@http/system/usersJobs";
export default {
  name: "JobInfo",
  props: {
    id: {
      type: Number,
      default: null,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      queryParam: {
        byOwner: true,
        orgLevelCodes: "1, 2, 4",
        typeCode: "2",
        stdTypeCodes: "1, 2",
        formCode: "CIFI",
        blurry: [],
        status: "4",
      },
      tableData: [],
      showGeneralList: false,
      showUniqueList: false,
      showSelectList: false,
      currentRow: null,
      selectList: [], // 选中的值
      loading: false,
      options: [],
      showOverflowTooltip: true,
      showBtnList: true,
    };
  },
  watch: {
    selectList: {
      handler(val) {
        if (val.length === 0) {
          this.showSelectList = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    console.log("父组件传递的值：", this.$props.user);
  },
  methods: {
    remoteMethod(query) {
      this.queryParam.blurry = query;
      if (query !== "") {
        this.loading = true;
        queryJobDefList(this.queryParam).then((res) => {
          this.loading = false;
          this.options = res.content.map((items) => {
            // 为了处理完全匹配的默认
            return { value: `val:${items.name}`, label: `${items.name}` };
          });
        });
      } else {
        this.options = [];
      }
    },
    getUsersJob() {
      if (this.queryParam.blurry === "") {
        return false;
      }
      getUsersJob(this.queryParam.blurry.split(":")[1]).then((res) => {
        const resData = res;
        // 通用岗是1  专用岗是2
        // 通用岗只展示部门信息 专用岗是组织和人员信息
        const stdType = resData.every((items) => {
          return items.jobDef.stdTypeCode === "1"; // 每一个都满足返回true 否则为false
        });
        if (stdType) {
          this.showGeneralList = true;
          this.showUniqueList = false;
          this.showBtnList = false;
        } else {
          this.showGeneralList = false;
          this.showUniqueList = true;
          this.showBtnList = false;
          this.$emit("moreWidth", "800px");
        }
        resData.forEach((item) => {
          item.deptName = item.dept.fullName;
          item.deptCode = item.dept.code;
          if (item.user) {
            item.nickname = item.user.nickName;
            item.username = item.user.username;
          } else {
            item.nickname = "";
            item.username = "";
          }
        });
        this.tableData = resData;
      });
    },
    handleCurrentChange(val) {
      console.log("当前选中的数据：", val);
      this.currentRow = val;
      this.showGeneralList = false;
      this.showUniqueList = false;
      this.showSelectList = true;
      this.showBtnList = true;
      this.queryParam.blurry = "";
      let bool = true;
      for (let i = 0; i < this.selectList.length; i++) {
        if (lodash.isEqual(this.selectList[i], this.currentRow)) {
          this.$message.error({
            message: "用户已申请该岗位，请勿重复申请！",
            duration: 2000,
          });
          bool = false;
        }
      }
      if (val.user !== null) {
        if (lodash.isEqual(val.user.id, this.$props.user.id)) {
          this.$message.error({
            message: "用户已申请该岗位，请勿重复申请！",
            duration: 2000,
          });
          bool = false;
        }
      }
      if (bool) {
        this.selectList = [...this.selectList, this.currentRow];
      }
    },
    cancelJob() {
      this.$emit("click", false);
    },
    delSelect(index) {
      this.selectList.splice(index, 1);
    },
    saveJob() {
      if (this.selectList.length === 0) {
        this.$message.error({
          message: "没有申请岗位",
          duration: 2000,
        });
        return false;
      }
      const newArr = this.selectList;
      const areaList = newArr.map((item) => {
        return item.deptName;
      });
      const uniqueList = Array.from(new Set(areaList));
      console.log(uniqueList);
      if (uniqueList.length > 1) {
        this.$message.error({
          message: "请选择同一个部门下的岗位组",
          duration: 2000,
        });
        return false;
      }
      const params = {
        usersJobsList: this.selectList,
        userId: this.$props.id,
      };
      addUsersJobs(JSON.stringify(params))
        .then((res) => {
          this.$message.success({
            message: "申请岗位成功",
            duration: 2000,
          });
          window.location.href = res;
          this.$matomo.trackEvent(
            "岗位权限-项目岗位申请",
            "申请岗位保存",
            params
          );
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: "申请岗位失败",
            duration: 2000,
          });
        });
    },
  },
};
</script>

<style scoped>
.job-container {
  padding-bottom: 40px;
  overflow-y: auto;
  height: 100vh;
}
.search-container /deep/ .el-icon-search {
  cursor: pointer;
}
.add-container {
  margin: 10px 0;
}
.job-list,
.select-list,
.select-list .select-item {
  margin: 10px 0;
}
.select-item {
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
}
.item-delete {
  vertical-align: middle;
  color: #ff0019;
}
.select-title {
  color: #333;
  font-size: 14px;
}
.select-desc {
  margin-top: 10px;
}
/deep/ .el-card__body {
  padding: 10px;
}
/deep/ .add-container .el-card__body {
  padding: 5px 15px;
}
</style>
