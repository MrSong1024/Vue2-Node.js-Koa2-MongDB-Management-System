<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span class="my-title">基础信息</span>
      </div>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">用户名称：</span>
            <span>{{ userInfo.nickName }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">用户账号：</span>
            <span>{{ userInfo.username }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">用户性别：</span>
            <span>{{ userInfo.sex }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">手机号：</span>
            <span>{{ userInfo.phone }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">身份证号：</span>
            <span>{{ userInfo.idCardNum }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">个人邮箱：</span>
            <span>{{ userInfo.email }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">公司邮箱：</span>
            <span>{{ userInfo.employMail }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content full-content">
            <span class="user-label">所属部门：</span>
            <span class="full-name">
              <el-popover
                placement="top-start"
                :content="userInfo.dept.fullName"
                trigger="hover"
              >
                <div
                  slot="reference"
                  class="full-name"
                >{{ userInfo.dept.fullName }} </div>
              </el-popover>
            </span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content full-content">
            <span class="user-label">部门编码：</span>
            <span class="full-name">
              <el-popover
                placement="top-start"
                :content="userInfo.dept.code"
                trigger="hover"
              >
                <div
                  slot="reference"
                  class="full-name"
                >{{ userInfo.dept.code }} </div>
              </el-popover>
            </span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">所属岗位：</span>
            <span>{{ userInfo.job && userInfo.job.name }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">管理人：</span>
            <span>{{ userInfo.ownerUserName }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">用户类型：</span>
            <span>{{ userType(userInfo.type) }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">上级姓名：</span>
            <span>{{ userInfo.leaderName }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">上级工号：</span>
            <span>{{ userInfo.leaderEmployNum }}</span>
          </div>
        </el-col>
        <template v-if="userInfo.type==='O2'">
          <el-col
            :xs="24"
            :sm="12"
            :md="8"
            :lg="8"
            :xl="8"
          >
            <div class="label-content full-content">
              <span class="user-label">所属项目：</span>
              <span class="full-name">
                <el-popover
                  placement="top-start"
                  :content="userInfo.project && userInfo.project.fullName"
                  trigger="hover"
                >
                  <div
                    slot="reference"
                    class="full-name"
                  >{{ userInfo.project && userInfo.project.fullName }} </div>
                </el-popover>
              </span>
            </div>
          </el-col>
        </template>
        <template v-if="userInfo.type==='O3'">
          <template v-if="userInfo.type==='O3'">
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="8"
            >
              <div class="label-content">
                <span class="user-label">所属产品：</span>
                <span>{{ userInfo.itProject && userInfo.itProject.name }}</span>
              </div>
            </el-col>
            <el-col
              :xs="24"
              :sm="12"
              :md="8"
              :lg="8"
              :xl="8"
            >
              <div class="label-content">
                <span class="user-label">所属供方：</span>
                <span>{{ userInfo.itSupplier && userInfo.itSupplier.name }}</span>
              </div>
            </el-col>
          </template>
        </template>
      </el-row>
    </el-card>
    <el-card class="box-card user-list">
      <div slot="header">
        <span class="my-title">岗位列表</span>
      </div>
      <el-table
        :data="usersJobsList"
        style="width: 100%"
      >
        <el-table-column
          prop="jobDefName"
          width="140"
          :show-overflow-tooltip="showOverflowTooltip"
          label="岗位组名称"
        />
        <el-table-column
          prop="jobDefCode"
          width="80"
          :show-overflow-tooltip="showOverflowTooltip"
          label="岗位组编码"
        />
        <el-table-column
          prop="deptName"
          :show-overflow-tooltip="showOverflowTooltip"
          label="岗位所在组织"
        />
        <el-table-column
          prop="typeCode"
          width="100"
          label="岗位组类型"
        />
        <el-table-column
          prop="stdType"
          width="150"
          :show-overflow-tooltip="showOverflowTooltip"
          label="岗位组性质"
        />
        <el-table-column
          prop="bizSys"
          label="业务系统"
          :show-overflow-tooltip="showOverflowTooltip"
        />
        <el-table-column
          prop="relType"
          width="80"
          label="岗位类型"
        />
        <el-table-column
          prop="jobCode"
          width="80"
          label="岗位编码"
        />
        <el-table-column
          prop="approval"
          width="100"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.approval && scope.row.approval.status === '1'">草稿</span>
            <span v-if="scope.row.approval && scope.row.approval.status === '2'">流程草稿</span>
            <span
              v-if="scope.row.approval && scope.row.approval.status === '3'"
              style="color: #e6a23c;"
            >审核中</span>
            <span
              v-if="scope.row.approval && scope.row.approval.status === '4'"
              style="color: #67c23a;"
            >已生效</span>
            <span v-if="scope.row.approval && scope.row.approval.status === '5'">已驳回</span>
            <span v-if="scope.row.approval && scope.row.approval.status === '6'">已撤回</span>
            <span v-if="scope.row.approval && scope.row.approval.status === '7'">已废弃</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        type="default"
        size="mini"
        @click="goBack()"
      >返回</el-button>
    </div>
  </div>
</template>

<script>
import { getUserDetail } from "@http/system/user";
export default {
  name: "UserDetail",
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      userInfo: {},
      usersJobsList: [],
      showOverflowTooltip: true,
    };
  },
  mounted() {
    this.getUserDetail(this.$props.id);
  },
  methods: {
    getUserDetail(argument) {
      getUserDetail(argument).then((res) => {
        this.userInfo = res.user;
        const resData = res.usersJobsList;
        resData.forEach((items) => {
          items.jobDefName = items.jobDef.name;
          items.jobDefCode = items.jobDef.code;
          items.bizSys = items.jobDef.bizSys;
          items.stdType =
            items.jobDef.stdTypeCode === "1"
              ? "通用岗位(一岗多人)"
              : items.jobDef.stdTypeCode === "2"
              ? "专用岗位(一岗一人)"
              : "非标岗";
          items.typeCode =
            items.jobDef.typeCode === "1"
              ? "行政岗"
              : items.jobDef.typeCode === "2"
              ? "业务岗"
              : "";
          items.deptName = items.dept.fullName;
          items.relType = items.relType === "1" ? "主岗" : "兼岗";
        });
        this.usersJobsList = resData;
      });
    },
    goBack() {
      this.$emit("click", false);
      this.$router.push({ path: "/query/user" });
    },
    userType(value) {
      switch (value) {
        case "E1":
          return "内部用户";
        case "E2":
          return "编外用户";
        case "O1":
          return "外部用户";
        case "O2":
          return "项目合作方用户";
        case "O3":
          return "供应商用户";

        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.user-list {
  margin: 10px 0;
}
.my-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: left;
}
.label-content,
.user-label {
  line-height: 28px;
  font-size: 12px;
}
.user-label {
  width: 70px;
  display: inline-block;
  text-align: right;
}
.full-content {
  display: flex;
}
.full-content .user-label {
  flex-basis: 70px;
  width: 70px;
  display: inline-block;
  text-align: right;
}
.full-name {
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
