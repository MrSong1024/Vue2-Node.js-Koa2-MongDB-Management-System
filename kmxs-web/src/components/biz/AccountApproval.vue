<template>
  <div
    id="accountApproval"
    :class="[mode === 'edit' ? 'multi-card' : 'multi-card view']"
  >
    <el-form ref="form" :model="approvalContent" :rules="rules">
      <!-- approval content -->
      <el-card class="box-card my-box-card clearfix">
        <div slot="header">
          <span class="title">基本信息</span>
        </div>
        <!-- 选择临开账号-->
        <div class="el-form-item el-form-item--mini" style="float: left">
          <label class="el-form-item__label" style="width: 120px"
            >临开账号：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="approvalContent.accountName"
              size="mini"
              :fetch-suggestions="queryUsers"
              placeholder="请选择临开账号"
              style="width: 160px"
              disabled
              @select="handleSelectUser"
            />
            <el-button
              type="text"
              size="mini"
              style="
                float: right;
                with: 60px;
                margin: 0 0 0 10px;
                padding: 7px 0;
              "
              @click="toUser()"
              >选择临开账号</el-button
            >
          </template>
          <div v-else class="el-form-item__content">
            {{ approvalContent.accountName }}
          </div>
        </div>

        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >申请类型：</label
          >
          <div
            v-if="mode === 'edit'"
            class="el-form-item__content"
            style="width: 270px"
          >
            <template v-if="approvalContent.approvalType === '3'"
              >编内账号临时启用</template
            >
          </div>
          <div v-else class="el-form-item__content">
            <template v-if="approvalContent.approvalType === '3'"
              >编内账号临时启用</template
            >
          </div>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >过期时间：</label
          >
          <el-date-picker
            v-if="mode === 'edit'"
            v-model="approvalContent.expireTime"
            type="date"
            size="mini"
            class="date-item"
            style="width: 270px"
            :picker-options="pickerOptions0"
          />
          <div v-else class="el-form-item__content">
            {{ $utils.parseTime(approvalContent.expireTime) }}
          </div>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left; width: 100%"
        >
          <label class="el-form-item__label" style="width: 120px"
            >申请原因：</label
          >
          <div
            v-if="mode === 'edit'"
            class="el-form-item__content"
            style="width: 90%"
          >
            <el-input
              v-model="approvalContent.remark"
              clearable
              type="textarea"
              size="mini"
              maxlength="400"
              placeholder="请填写申请原因"
              style="resize: none; min-height: 50px"
              rows="3"
              show-word-limit
              class="filter-item"
            />
          </div>
          <div v-else class="el-form-item__content">
            {{ approvalContent.remark }}
          </div>
        </div>
        <el-dialog
          v-if="supplierDialog.show"
          class="custom_el_dialog"
          :append-to-body="true"
          :visible.sync="supplierDialog.show"
          :title="supplierDialog.title"
          width="800px"
          height="100vh"
        >
          <SupplierList
            :key="timer"
            :radio-val="supplierRadioVal"
            :title="supplierTitle"
            @selectChange="handleSupplierChange"
          />
        </el-dialog>
        <el-dialog
          v-if="projectDialog.show"
          class="custom_el_dialog"
          :append-to-body="true"
          :visible.sync="projectDialog.show"
          :title="projectDialog.title"
          width="800px"
          height="100vh"
        >
          <ProductList
            :key="timer"
            :radio-val="projectRadioVal"
            @selectChange="handleProjectChange"
          />
        </el-dialog>
        <el-dialog
          class="custom_el_dialog"
          :append-to-body="true"
          :visible.sync="userSelDialog.show"
          :title="userSelDialog.title"
          width="1200px"
          height="100vh"
        >
          <user-selector
            :key="timer"
            ref="userSelector"
            :select-type="userListSelectType"
            :passed-in-param="userListQueryParam"
            :show-advanced-filter="userListAdvancedFilter"
            @selectChange="handleUserSelChange"
          />
        </el-dialog>
      </el-card>
    </el-form>
    <div
      v-if="mode === 'edit' || mode === 'view'"
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        v-if="
          mode === 'edit' &&
          approval.status !== '3' &&
          approval.status !== '4' &&
          approval.status !== '7'
        "
        type="primary"
        size="mini"
        @click="doSave()"
        >保存</el-button
      >
      <el-button
        v-if="
          mode === 'edit' &&
          approval.status !== '3' &&
          approval.status !== '4' &&
          approval.status !== '7'
        "
        type="warning"
        size="mini"
        @click="doSubmitFlow()"
        >预览并提交</el-button
      >
      <el-button
        v-if="mode === 'edit' && showDisableBtn"
        type="danger"
        size="mini"
        @click="delApproval"
      >
        作废
      </el-button>
      <el-button
        v-if="
          mode === 'view' &&
          user.username === approval.ownerUser &&
          approval.status !== null &&
          approval.status !== undefined &&
          approval.status !== '1' &&
          approval.status !== '2'
        "
        type="primary"
        size="mini"
        @click="toViewFlow()"
        >查看审批状态</el-button
      >
      <el-button
        v-if="user.username === approval.ownerUser"
        type="default"
        size="mini"
        @click="goBack()"
        >返回</el-button
      >
    </div>
  </div>
</template>

<script>
import {
  getApproval,
  add,
  edit,
  submitFlow,
  viewFlow,
  del,
} from "@http/system/approval";
import { getUsers } from "@http/system/user";
import CRUD from "@crud/crud";
import { mapGetters } from "vuex";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SupplierList from "@/components/biz/SupplierList";
import ProductList from "@/components/biz/ProductList";
import UserSelector from "@/components/biz/AccountSelector";

export default {
  name: "AccountApproval",
  components: { SupplierList, ProductList, UserSelector },
  props: {
    mode: {
      type: String,
      default: "edit",
    },
    approvalId: {
      type: String,
      default: undefined,
    },
    selectedUsers: {
      type: Array,
      default: undefined,
    },
    bizAction: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      defaultProps: { children: "children", label: "name" },
      userType: "E1",
      projects: [],
      suppliers: [],
      roles: [],
      timeout: null,
      userAttr: "",
      approval: {
        id: null,
        flowKey: "",
        instanceId: null,
        taskId: null,
        subject: "",
        content: null,
        status: "1",
        ownerUser: null,
        ownerDept: null,
        bizAction: this.bizAction,
      },
      approvalContent: {
        users: [],
        account: "",
        accountName: "",
        expireTime: undefined,
        remark: "",
        approvalType: this.bizAction,
        attributes: "",
      },
      permission: {
        userList: ["admin", "user:list"],
        approvalList: ["admin", "approval:list"],
        approvalEdit: ["admin", "approval:edit"],
        approvalDel: ["admin", "approval:del"],
        approvalAdd: ["admin", "approval:add"],
      },
      // 日期选择器时间范围控制
      pickerOptions0: {
        disabledDate(time) {
          const curDate = new Date().getTime();
          const three = 3 * 24 * 3600 * 1000;
          const threeMonths = curDate + three;
          return time.getTime() < Date.now() || time.getTime() > threeMonths;
        },
      },
      rules: {
        // nickName: [
        //   { required: true, message: '请输入用户姓名', trigger: 'blur' },
        // phone: [{ required: true, trigger: 'blur', validator: validPhone }],
        // email: [{ required: true, trigger: 'blur', validator: validMail }]
      },
      expandNodes: [],
      depts: [],
      supplierDialog: { title: "选择", show: false },
      projectDialog: { title: "选择产品", show: false },
      userSelDialog: { title: "选择用户", show: false },
      timer: "",
      supplierTitle: "",
      approvalStatus: null,
      showDisableBtn: false,
      userListSelectType: "radio",
      userListQueryParam: {
        deptCode: "",
        deptId: undefined,
        status: "0",
        type: "E1",
      },
      userListAdvancedFilter: false,
      autoClass: null,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    supplierRadioVal() {
      return this.approvalContent.itSupplier &&
        this.approvalContent.itSupplier.name
        ? this.approvalContent.itSupplier.name +
            "-" +
            this.approvalContent.itSupplier.id
        : "";
    },
    projectRadioVal() {
      return this.approvalContent.itProject &&
        this.approvalContent.itProject.name
        ? this.approvalContent.itProject.name +
            "-" +
            this.approvalContent.itProject.id
        : "";
    },
  },
  created() {
    this.initApproval();
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
    this.flexColumnWidth();
  },
  methods: {
    flexColumnWidth() {
      // 获取设备宽度
      const width = window.screen.availWidth;
      if (width < 768) {
        // 手机端 full-content
        this.autoClass = "autoClass";
      }
    },

    // 选择用户
    toUser() {
      this.userSelDialog.show = true;
      this.timer = new Date().getTime();
    },
    handleSelectUser(item) {
      this.approvalContent.account = item.username;
      this.approvalContent.accountName = item.nickName;
    },

    // 选择用户
    handleUserSelChange(params) {
      const data = params[0];
      this.approvalContent.users = data;
      this.approvalContent.account = data.username;
      this.approvalContent.accountName = data.nickName;
      this.userSelDialog.show = false;
    },

    // 获取用户数据
    queryUsers(queryString, cb) {
      if (queryString) {
        var userData = [{}];
        const params = {};
        params.blurry = queryString;
        getUsers(params).then((res) => {
          for (const item of res.content) {
            item.value = item.nickName;
            userData.push(item);
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(userData);
          }, 1000 * Math.random());
        });
      } else {
        cb([{}]);
      }
    },

    initApproval() {
      if (this.approvalId) {
        // 新用户申请/编辑/查看/预览场景
        console.log("333333333");
        getApproval(this.approvalId, this.mode)
          .then((res) => {
            if (res) {
              this.approval = res;
              this.approvalStatus = res.status;
              const statusList = ["5", "6"]; // 撤销或者作废
              if (statusList.includes(this.approvalStatus)) {
                // 显示作废按钮
                this.showDisableBtn = true;
              }
              if (res.content) {
                this.approvalContent = JSON.parse(res.content);
                this.userType = this.approvalContent.users[0].type;
                this.userAttr = this.approvalContent.attributes.toString();
              }
            }
          })
          .catch(() => {});
      } else if (this.selectedUsers) {
        // 延期/启用申请场景，传递待审批用户参数
        this.approvalContent.users = this.selectedUsers;
        this.userType = this.approvalContent.users[0].type;
        this.userAttr = this.approvalContent.attributes;
      }
    },

    selectUser(data) {
      for (let i = 0; i < data.length; i++) {
        let existed = false;
        for (let j = 0; j < this.approvalContent.users.length; j++) {
          if (data[i].id === this.approvalContent.users[j].id) {
            existed = true;
            break;
          }
        }
        if (!existed) {
          this.approvalContent.users.push(data[i]);
        }
      }
    },
    // 提交前验证
    validate() {
      return new Promise((resolve, reject) => {
        if (!this.approvalContent.expireTime) {
          this.$message.error({
            message: "请选择过期时间",
            duration: 2000,
          });
          resolve(false);
        } else if (this.approvalContent.remark === "") {
          this.$message.error({
            message: "请填写申请原因",
            duration: 2000,
          });
          resolve(false);
        }
        resolve(true);
      });
    },

    // 保存申请
    saveApproval() {
      return new Promise((resolve, reject) => {
        this.validate()
          .then((res) => {
            if (res) {
              // START--校验成功后执行保存逻辑

              // 1, 设置审批标题及flowkey
              const approvalSub0 = "【临开账号审核】";
              let approvalSub1 = "";
              let approvalSub2 = "";
              if (this.userType === "E1") {
                approvalSub1 = "编内用户";
                this.approval.flowKey = "IN_STAFF_USER_APPLY";
              }
              if (this.approvalContent.approvalType === "3") {
                approvalSub2 = "临时启用";
              }
              this.approval.subject = approvalSub0
                .concat(approvalSub1)
                .concat(approvalSub2)
                .concat("申请");
              this.approval.content = JSON.stringify(this.approvalContent);
              // 3, 保存或更新
              if (!this.approval.id) {
                console.log("this.approval: ", this.approval);
                add(this.approval)
                  .then((res) => {
                    this.approval.id = res.id;
                    resolve(true);
                  })
                  .catch(() => {
                    this.$message.error({
                      message: "保存审批信息失败",
                      duration: 2000,
                    });
                    resolve(false);
                  });
              } else {
                console.log("edit this.approval: ", this.approval);
                edit(this.approval)
                  .then((res) => {
                    resolve(true);
                  })
                  .catch(() => {
                    this.$message.error({
                      message: "保存审批信息失败",
                      duration: 2000,
                    });
                    resolve(false);
                  });
              }
              // END --校验成功后执行保存逻辑
            } else {
              resolve(false);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
    doSave() {
      this.saveApproval()
        .then((res) => {
          if (res) {
            this.$message.success({
              message: "保存审批信息成功",
              duration: 2000,
            });
          }
        })
        .catch(() => {});
    },
    // 预览并提交到OA
    doSubmitFlow() {
      this.saveApproval()
        .then((res) => {
          console.log(res);
          if (res) {
            submitFlow(this.approval.id, false)
              .then((res) => {
                console.log(this.approval.id);
                console.log(res);
                window.location.href = res;
              })
              .catch(() => {
                this.$message.error({
                  message: "提交流程失败",
                  duration: 2000,
                });
              });
          }
        })
        .catch(() => {
          this.$message.error({
            message: "提交流程失败",
            duration: 2000,
          });
        });
    },
    // 作废
    delApproval() {
      this.$confirm("确定要作废吗？")
        .then((_) => {
          del(new Array(this.approvalId))
            .then((res) => {
              console.log("作废", res);
              this.$message.success({
                message: "作废成功!",
                duration: 2000,
              });
              this.$router.push({ path: "/workbench/account" });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((_) => {});
    },
    toViewFlow() {
      viewFlow(this.approvalId)
        .then((res) => {
          if (res) {
            window.open(res);
          }
        })
        .catch(() => {});
    },
    // 取消返回申请页
    goBack() {
      // if(!this.approvalId){
      //   this.$router.push({ path: "/workbench/users", params: {} });
      // } else {
      this.$router.push({ path: "/workbench/account", params: {} });
      // }
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

<style scoped>
#accountApproval .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#accountApproval .crud-opts .crud-opts-right {
  margin-left: auto;
}
.my-box-card {
  overflow: visible;
}
.clearfix::after {
  display: block;
  height: 0;
  clear: both;
  font-size: 0;
  visibility: hidden;
  content: " ";
}
.O2-label {
  width: 50%;
  margin-bottom: 10px;
}
.E2-label {
  margin-bottom: 10px;
}
.O2-label .el-radio-group,
.E2-label .el-radio-group {
  line-height: 40px;
}
.full-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 120px;
}
.autoClass {
  display: inline-block;
  width: 200px;
  overflow-x: auto;
}
.compute-label {
  width: 100%;
}
/deep/ .my-box-card .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
/deep/ .el-dialog__body {
  padding: 0px 20px 20px;
}
</style>
