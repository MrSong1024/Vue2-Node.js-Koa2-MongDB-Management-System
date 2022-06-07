<template>
  <div
    :class="[mode === 'edit' ? 'multi-card' : 'multi-card view']"
    id="userTransfer"
  >
    <el-form :model="transfer" ref="form" :rules="rules">
      <el-card class="box-card">
        <div slot="header">
          <span class="title">移交原因</span>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left; width: 100%"
        >
          <el-input
            v-if="mode === 'edit'"
            v-model="transfer.remark"
            clearable
            type="textarea"
            size="mini"
            maxlength="800"
            placeholder="请填写移交原因"
            style="resize: none; min-height: 50px"
            rows="3"
            class="filter-item"
          />
          <div v-else class="el-form-item__content" style="width: 100%">
            {{ transfer.remark }}
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header">
          <span class="title">已选择用户</span>
        </div>
        <div>
          <el-table
            ref="table"
            :data="transferContent.users"
            style="width: 100%"
            :stripe="true"
          >
            <el-table-column
              type="index"
              align="center"
              width="60px"
              label="序号"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="nickName"
              width="120px"
            >
              <template slot="header">
                <span class="star">*</span>
                <span>用户姓名</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.nickName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="sex"
              width="160px"
            >
              <template slot="header">
                <span class="star">*</span>
                <span>用户性别</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.sex }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="idCardNum">
              <template slot="header">
                <span class="star">*</span>
                <span>身份证号</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.idCardNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="phone">
              <template slot="header">
                <span class="star">*</span>
                <span>手机号码</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="email">
              <template slot="header">
                <span class="star">*</span>
                <span>个人邮箱</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="mode === 'edit'"
              label="操作"
              width="120"
              align="left"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="deleteUser(scope.$index, scope.row.id)"
                  >移除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
      <el-card v-if="mode === 'edit'" class="box-card">
        <div slot="header">
          <span class="title">选择移交对象</span>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left; width: 100%"
        >
          <el-row :gutter="20" style="height: 450px">
            <!--侧边部门数据-->
            <el-col :span="5" class="org-tree-col" style="overflow-y: auto">
              <org-tree @treeItemClick="handleTreeItemClick" />
            </el-col>
            <!--用户数据-->
            <el-col :span="19" class="user-list-col" style="overflow-y: auto">
              <user-list
                :selectType="userListSelectType"
                :passedInParam="userListQueryParam"
                @selectChange="handleRadioSelChange"
                ref="userList"
              />
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-form>
    <div slot="footer" class="bottom-btn-groups">
      <el-button
        v-if="mode === 'edit'"
        type="primary"
        size="mini"
        @click="saveTransfer()"
        >移交</el-button
      >
      <el-button type="default" size="mini" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getTransfer, add, edit } from "@http/system/transfer";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import pagination from "@crud/Pagination";
import { mapGetters } from "vuex";
import OrgTree from "@/components/biz/OrgTree";
import UserList from "@/components/biz/UserList";

export default {
  name: "UserTransfer",
  components: { pagination, OrgTree, UserList },
  props: {
    mode: {
      type: String,
      default: "edit",
    },
    transferId: {
      type: String,
      default: undefined,
    },
    selectedUsers: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      defaultProps: { children: "children", label: "name" },
      userListSelectType: "radio",
      userListQueryParam: { status: "1", deptCode: "", deptId: undefined },
      transfer: {
        id: null,
        type: "1",
        content: null,
        transferUser: null,
        transferDept: null,
        receiverUser: null,
        receiverDept: null,
        remark: "",
      },
      transferContent: {
        users: [],
      },
      permission: {
        transferList: ["admin", "transfer:list"],
        transferEdit: ["admin", "transfer:edit"],
        transferDel: ["admin", "transfer:del"],
        transferAdd: ["admin", "transfer:add"],
      },
      rules: {
        remark: [
          { required: true, message: "请输入移交原因", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  created() {
    this.initTransfer();
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
  },
  methods: {
    initTransfer() {
      if (this.transferId) {
        // 编辑/查看/预览场景
        getTransfer(this.transferId, this.mode)
          .then((res) => {
            if (res) {
              this.transfer = res;
              if (res.content) {
                this.transferContent = JSON.parse(res.content);
              }
            }
          })
          .catch(() => {});
      } else if (this.selectedUsers) {
        // 新建场景，传递待审批用户参数
        this.transferContent.users = this.selectedUsers;
      }
    },
    // 删除用户
    deleteUser(index) {
      this.transferContent.users.splice(index, 1);
    },
    handleTreeItemClick(data) {
      this.userListQueryParam.deptCode = data.code;
      this.userListQueryParam.deptId = data.id;
      this.$refs.userList.getUserData();
    },
    handleRadioSelChange(data) {
      this.transfer.receiverUser = data.username;
      this.transfer.receiverDept = data.dept.code;
    },
    // 提交前验证
    validate() {
      return new Promise((resolve, reject) => {
        if (!this.transfer.remark) {
          this.$message.error({
            message: "请选择移交原因",
            duration: 2000,
          });
          resolve(false);
        } else if (
          !this.transferContent.users ||
          this.transferContent.users.length <= 0
        ) {
          this.$message.error({
            message: "请添加用户信息",
            duration: 2000,
          });
          resolve(false);
        } else if (!this.transfer.receiverUser || !this.transfer.receiverDept) {
          this.$message.error({
            message: "请选择被移交人",
            duration: 2000,
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    },
    // 提交转移
    saveTransfer() {
      this.validate()
        .then((res) => {
          if (res) {
            this.transfer.content = JSON.stringify(this.transferContent);
            add(this.transfer)
              .then((res) => {
                this.transfer.id = res.id;
                this.$message.success({
                  message: "移交成功",
                  duration: 2000,
                });
                this.goBack();
              })
              .catch(() => {
                this.$message.error({
                  message: "移交失败",
                  duration: 2000,
                });
              });
            // END --校验成功后执行保存逻辑
          }
        })
        .catch(() => {});
    },
    // 取消返回申请页
    goBack() {
      this.$router.push({
        path: "/workbench/users",
        params: {},
      });
    },
    [CRUD.HOOK.afterAddError](crud) {
      this.afterErrorMethod(crud);
    },
    [CRUD.HOOK.afterEditError](crud) {
      this.afterErrorMethod(crud);
    },
    afterErrorMethod(crud) {},
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {},
    // 打开编辑弹窗前做的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {},
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {},
  },
};
</script>

<style>
#userTransfer .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#userTransfer .crud-opts .crud-opts-right {
  margin-left: auto;
}
#userTransfer .org-tree-col {
  /*border-right: 1px solid #f5f5f5;*/
  height: 100%;
}
#userTransfer .user-list-col {
  border-left: 1px solid #f5f5f5;
  height: 100%;
}
</style>
