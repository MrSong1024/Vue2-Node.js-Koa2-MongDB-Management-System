<template>
  <div
    id="userEnroll"
    :class="[mode === 'edit' ? 'multi-card' : 'multi-card view']"
  >
    <el-form ref="form" :model="enroll" :rules="rules">
      <el-card class="box-card my-box-card clearfix">
        <div slot="header">
          <span class="title">基本信息</span>
        </div>
        <div
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >用户类型：</label
          >
          <el-select
            v-if="mode === 'edit'"
            v-model="userType"
            clearable
            size="mini"
            placeholder="用户类型"
            class="filter-item"
            style="width: 270px"
            @change="selectUserType"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <div v-else class="el-form-item__content" style="width: 270px">
            <template v-if="userType === 'O3'">供应商用户</template>
            <template v-else-if="userType === 'E2'">编外用户</template>
            <template v-else-if="userType === 'O2'">项目合作方用户</template>
          </div>
        </div>
        <div
          v-if="userType === 'O3'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >用户属性：</label
          >
          <el-select
            v-if="mode === 'edit'"
            v-model="enrollContent.attributes"
            clearable
            size="mini"
            placeholder="用户属性"
            class="filter-item"
            style="width: 270px"
            @change="selectSupplierUserAttr"
          >
            <el-option
              v-for="item in supplierAttrOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <div v-else class="el-form-item__content">
            {{ enrollContent.attributes === 4 ? "IT" : "非IT" }}
          </div>
        </div>

        <!-- O3 供应商 -->
        <div
          v-if="userType === 'O3' && enrollContent.attributes === 4"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属产品：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="enrollContent.itProject.name"
              size="mini"
              :fetch-suggestions="queryProjects"
              placeholder="请选择产品名称"
              style="width: 200px"
              disabled
              @select="handleSelectProject"
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
              @click="toItProduct()"
              >选择IT产品</el-button
            >
          </template>
          <div v-else class="el-form-item__content" style="width: 270px">
            {{ enrollContent.itProject.name }}
          </div>
        </div>
        <div
          v-if="userType === 'O3'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属供方：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="enrollContent.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请选择供方"
              style="width: 200px"
              disabled
              @select="handleSelectSupplier"
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
              @click="toItSupplier('supplier')"
              >选择供方</el-button
            >
          </template>
          <div v-else class="el-form-item__content" style="width: 270px">
            {{ enrollContent.itSupplier.name }}
          </div>
        </div>
        <!-- O2 项目合作方 -->
        <div
          v-if="userType === 'O2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属项目：</label
          >
          <div class="el-form-item__content">
            <treeselect
              v-model="enrollContent.project.id"
              :options="depts"
              style="width: 270px; height: 26px"
              size="mini"
              placeholder="选择项目"
              :disable-branch-nodes="true"
              @select="selectProject"
            />
          </div>
        </div>
        <div
          v-if="userType === 'O2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属合作方：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="enrollContent.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请选择合作方"
              style="width: 200px"
              disabled
              @select="handleSelectSupplier"
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
              @click="toItSupplier('partner')"
              >选择合作方</el-button
            >
          </template>
          <div v-else class="el-form-item__content" style="width: 270px">
            {{ enrollContent.itSupplier.name }}
          </div>
        </div>
        <!-- E2 编外用户 -->
        <div
          v-if="userType === 'E2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属部门：</label
          >
          <div class="el-form-item__content">
            <treeselect
              v-model="enrollContent.dept.id"
              :options="depts"
              style="width: 270px; height: 26px"
              size="mini"
              placeholder="选择部门"
              @select="selectFun"
            />
          </div>
        </div>
        <div
          v-if="userType === 'E2'"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >用户属性：</label
          >
          <el-select
            v-model="userAttr"
            clearable
            size="mini"
            placeholder="用户属性"
            class="filter-item"
            style="width: 270px"
            @change="selectUserAttr"
          >
            <el-option
              v-for="item in attrOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </div>
        <div
          v-if="userType === 'E2' && ['1', '3'].includes(userAttr)"
          class="el-form-item is-required el-form-item--mini"
          style="float: left"
        >
          <label class="el-form-item__label" style="width: 120px"
            >所属派遣方：</label
          >
          <template v-if="mode === 'edit'">
            <el-autocomplete
              v-model="enrollContent.itSupplier.name"
              size="mini"
              :fetch-suggestions="querySuppliers"
              placeholder="请选择派遣方"
              style="width: 200px"
              disabled
              @select="handleSelectSupplier"
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
              @click="toItSupplier('sender')"
              >选择派遣方</el-button
            >
          </template>
          <div v-else class="el-form-item__content" style="width: 270px">
            {{ enrollContent.itSupplier.name }}
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header">
          <span class="title">已选择用户</span>
          <el-button
            v-if="mode === 'edit'"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right"
            @click="showUserSelDialog()"
            >选择</el-button
          >
        </div>
        <div>
          <el-table
            ref="table"
            :data="enrollContent.users"
            style="width: 100%"
            :stripe="true"
          >
            <el-table-column
              type="index"
              align="center"
              width="60px"
              label="序号"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="nickName"
              width="120px"
            >
              <template slot="header">
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
                <span>用户性别</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.sex }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="idCardNum">
              <template slot="header">
                <span>身份证号</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.idCardNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="phone">
              <template slot="header">
                <span>手机号码</span>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="email">
              <template slot="header">
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
      <!-- user select dialog -->
      <el-dialog
        v-if="mode === 'edit'"
        class="custom_el_dialog"
        :append-to-body="true"
        :visible.sync="userSelDialog.show"
        :title="userSelDialog.title"
        width="1000px"
        height="100%"
      >
        <user-selector
          ref="userSelector"
          :select-type="userListSelectType"
          :passed-in-param="userListQueryParam"
          :show-advanced-filter="userListAdvancedFilter"
          @selectChange="handleUserSelChange"
        />
      </el-dialog>
      <el-dialog
        v-if="mode === 'edit' && supplierDialog.show"
        class="custom_el_dialog"
        :append-to-body="true"
        :visible.sync="supplierDialog.show"
        :title="supplierDialog.title"
        width="800px"
        height="100%"
      >
        <SupplierList
          :key="timer"
          :radio-val="supplierRadioVal"
          :title="supplierTitle"
          @selectChange="handleSupplierChange"
        />
      </el-dialog>
      <el-dialog
        v-if="mode === 'edit' && projectDialog.show"
        class="custom_el_dialog"
        :append-to-body="true"
        :visible.sync="projectDialog.show"
        :title="projectDialog.title"
        width="800px"
        height="100%"
      >
        <ProductList
          :key="timer"
          :radio-val="projectRadioVal"
          @selectChange="handleProjectChange"
        />
      </el-dialog>
    </el-form>
    <div slot="footer" class="bottom-btn-groups">
      <el-button
        v-if="mode === 'edit'"
        type="primary"
        size="mini"
        @click="saveEnroll()"
        >认领</el-button
      >
      <el-button type="default" size="mini" @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getEnroll, add } from "@http/system/enroll";
import CRUD from "@crud/crud";
import UserSelector from "@/components/biz/UserSelector";
import { getProjects } from "@http/system/itProject";
import { getSuppliers } from "@http/system/itSupplier";
import { getHrTypeCode } from "@http/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import SupplierList from "@/components/biz/SupplierList";
import ProductList from "@/components/biz/ProductList";

export default {
  name: "UserEnroll",
  components: { UserSelector, Treeselect, SupplierList, ProductList },
  props: {
    mode: {
      type: String,
      default: "edit",
    },
    enrollId: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + "px;",
      defaultProps: { children: "children", label: "name" },
      userType: "",
      userListSelectType: "checkbox",
      userListQueryParam: {
        type: "",
        ownerUser: "0",
        deptCode: "",
        deptId: undefined,
      },
      userListAdvancedFilter: false,
      timeout: null,
      userSelDialog: { title: "选择用户", show: false },
      supplierDialog: { title: "选择", show: false },
      projectDialog: { title: "选择产品", show: false },
      enroll: {
        id: null,
        type: "1",
        content: null,
        enrollUser: null,
        enrollDept: null,
      },
      enrollContent: {
        users: [],
        itProject: {},
        itSupplier: {},
        dept: {
          id: null,
        },
        project: {
          id: null,
        },
        attributes: "",
      },
      typeOptions: [
        { key: "O3", display_name: "供应商用户" },
        { key: "E2", display_name: "编外用户" },
        { key: "O2", display_name: "项目合作方用户" },
      ],
      permission: {
        transferList: ["admin", "enroll:list"],
        transferEdit: ["admin", "enroll:edit"],
        transferDel: ["admin", "enroll:del"],
        transferAdd: ["admin", "enroll:add"],
      },
      rules: {},
      expandNodes: [],
      depts: [],
      userAttr: "",
      attrOptions: [
        { key: "1", display_name: "劳务派遣" },
        { key: "3", display_name: "劳务外包" },
        { key: "2", display_name: "实习生" },
      ],
      timer: "",
      supplierTitle: "",
      supplierAttrOptions: [
        { key: 4, display_name: "IT" },
        { key: 5, display_name: "非IT" },
      ],
    };
  },
  computed: {
    supplierRadioVal() {
      return this.enrollContent.itSupplier && this.enrollContent.itSupplier.name
        ? this.enrollContent.itSupplier.name +
            "-" +
            this.enrollContent.itSupplier.id
        : "";
    },
    projectRadioVal() {
      return this.enrollContent.itProject && this.enrollContent.itProject.name
        ? this.enrollContent.itProject.name +
            "-" +
            this.enrollContent.itProject.id
        : "";
    },
  },
  created() {
    this.initEnroll();
  },
  mounted: function () {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + "px;";
    };
  },
  methods: {
    selectSupplierUserAttr(e) {
      if (e === "4") {
        // IT
        this.enrollContent.attributes = 4;
      } else if (e === "5") {
        // 非IT
        this.enrollContent.attributes = 5;
        this.enrollContent.itProject = {};
      }
    },
    // 获取弹窗内部门数据
    getHrTypeCode(hrTypeCode) {
      getHrTypeCode(hrTypeCode).then((res) => {
        this.expandNodes = res.content.length > 0 ? [res.content[0].id] : [];
        this.depts = res.content;
      });
    },
    selectFun(node) {
      this.enrollContent.dept = node;
    },
    selectProject(node) {
      this.enrollContent.project = node;
    },
    initEnroll() {
      if (this.enrollId) {
        // 编辑/查看/预览场景
        getEnroll(this.enrollId, this.mode)
          .then((res) => {
            if (res) {
              this.enroll = res;
              if (res.content) {
                this.enrollContent = JSON.parse(res.content);
              }
            }
          })
          .catch(() => {});
      }
    },
    toItProduct() {
      this.projectDialog.show = true;
      this.timer = new Date().getTime();
    },
    toItSupplier(argument) {
      let title = "";
      switch (argument) {
        case "supplier":
          title = "供方";
          break;
        case "partner":
          title = "合作方";
          break;
        case "sender":
          title = "派遣方";
          break;
      }
      this.supplierTitle = title;
      this.supplierDialog.show = true;
      this.supplierDialog.title = "选择" + this.supplierTitle;
      this.timer = new Date().getTime();
    },
    // 选择供应商
    handleSupplierChange(params) {
      this.enrollContent.itSupplier = params;
      this.supplierDialog.show = false;
    },
    handleProjectChange(params) {
      this.enrollContent.itProject = params;
      this.projectDialog.show = false;
    },
    selectUserType(e) {
      // 外包人员(项目合作方用户(21))
      if (e === "O2") {
        this.enrollContent.itProject = {};
        this.enrollContent.itSupplier = {};
        this.getHrTypeCode("21");
      } else if (e === "E2") {
        this.enrollContent.itProject = {};
        this.enrollContent.itSupplier = {};
        this.getHrTypeCode("20");
      } else if (e === "O3") {
        this.enrollContent.dept = { id: null };
        this.enrollContent.project = { id: null };
      }
      this.userListQueryParam.type = this.userType;
      console.log(
        "this.userListQueryParam",
        this.userListQueryParam,
        this.userType
      );
    },
    // 获取IT供应商数据
    querySuppliers(queryString, cb) {
      if (queryString) {
        var supplierData = [{}];
        const params = {};
        params.name = queryString;
        getSuppliers(params).then((res) => {
          for (const item of res.content) {
            item.value = item.name;
            supplierData.push(item);
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(supplierData);
          }, 1000 * Math.random());
        });
      } else {
        cb([{}]);
      }
    },
    // 获取IT产品
    queryProjects(queryString, cb) {
      if (queryString) {
        var projectData = [{}];
        const params = {};
        params.name = queryString;
        getProjects(params).then((res) => {
          for (const item of res.content) {
            item.value = item.name;
            projectData.push(item);
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(projectData);
          }, 1000 * Math.random());
        });
      } else {
        cb([{}]);
      }
    },
    handleSelectSupplier(item) {
      this.enrollContent.itSupplier = item;
    },
    handleSelectProject(item) {
      this.enrollContent.itProject = item;
    },
    showUserSelDialog() {
      if (!this.userType) {
        this.$message.error({
          message: "请选择用户类型",
          duration: 2000,
        });
      } else {
        this.userSelDialog.show = true;
      }
    },
    // 删除用户
    deleteUser(index) {
      this.enrollContent.users.splice(index, 1);
    },
    handleUserSelChange(data) {
      for (let i = 0; i < data.length; i++) {
        let existed = false;
        for (let j = 0; j < this.enrollContent.users.length; j++) {
          if (data[i].id === this.enrollContent.users[j].id) {
            existed = true;
            break;
          }
        }
        if (!existed) {
          this.enrollContent.users.push(data[i]);
        }
      }
      this.userSelDialog.show = false;
    },
    // 提交前验证
    validate() {
      return new Promise((resolve, reject) => {
        if (!this.userType) {
          this.$message.error({
            message: "请选择用户类型",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O3" &&
          this.enrollContent.attributes === 4 &&
          (!this.enrollContent.itProject.id ||
            !this.enrollContent.itProject.name)
        ) {
          this.$message.error({
            message: "请选择所属产品",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O3" &&
          (!this.enrollContent.itSupplier.id ||
            !this.enrollContent.itSupplier.name)
        ) {
          this.$message.error({
            message: "请选择所属供方",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O2" &&
          (!this.enrollContent.itSupplier.id ||
            !this.enrollContent.itSupplier.name)
        ) {
          this.$message.error({
            message: "请选择所属合作方",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "O2" &&
          (!this.enrollContent.project.id || !this.enrollContent.project.name)
        ) {
          this.$message.error({
            message: "请选择所属项目",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "E2" &&
          this.enrollContent.attributes === ""
        ) {
          this.$message.error({
            message: "请选择用户属性",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "E2" &&
          ["1", "3"].includes(this.enrollContent.attributes) &&
          (!this.enrollContent.itSupplier.id ||
            !this.enrollContent.itSupplier.name)
        ) {
          this.$message.error({
            message: "请选择所属派遣方",
            duration: 2000,
          });
          resolve(false);
        } else if (
          this.userType === "E2" &&
          (!this.enrollContent.dept.id || !this.enrollContent.dept.name)
        ) {
          this.$message.error({
            message: "请选择所属部门",
            duration: 2000,
          });
          resolve(false);
        } else if (
          !this.enrollContent.users ||
          this.enrollContent.users.length <= 0
        ) {
          this.$message.error({
            message: "请添加用户信息",
            duration: 2000,
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    },
    // 提交补录
    saveEnroll() {
      this.validate()
        .then((res) => {
          if (res) {
            if (this.userType === "O3") {
              for (let i = 0; i < this.enrollContent.users.length; i++) {
                this.enrollContent.users[i].itProject =
                  this.enrollContent.itProject;
                this.enrollContent.users[i].itSupplier =
                  this.enrollContent.itSupplier;
              }
            } else if (this.userType === "E2") {
              for (let i = 0; i < this.enrollContent.users.length; i++) {
                this.enrollContent.users[i].dept = this.enrollContent.dept;
              }
            } else if (this.userType === "O2") {
              for (let i = 0; i < this.enrollContent.users.length; i++) {
                this.enrollContent.users[i].project =
                  this.enrollContent.project;
              }
            }
            if (this.enrollContent.attributes === 2) {
              this.enrollContent.itSupplier = null;
            }
            if (JSON.stringify(this.enrollContent.itProject) === "{}") {
              this.enrollContent.itProject = null;
            }
            if (JSON.stringify(this.enrollContent.itSupplier) === "{}") {
              this.enrollContent.itSupplier = null;
            }
            this.enroll.content = JSON.stringify(this.enrollContent);
            add(this.enroll)
              .then((res) => {
                this.enroll.id = res.id;
                this.$message.success({
                  message: "认领成功",
                  duration: 2000,
                });
                this.goBack();
              })
              .catch(() => {
                this.$message.error({
                  message: "认领失败",
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
    selectUserAttr(e) {
      if (e === "1") {
        // 劳务派遣
        this.enrollContent.attributes = "1";
      } else if (e === "2") {
        // 实习生
        this.enrollContent.attributes = "2";
      } else {
        // 劳务外包
        this.enrollContent.attributes = "3";
      }
    },
  },
};
</script>

<style scoped>
#userEnroll .crud-opts {
  /*padding: 6px 0;*/
  padding: 0 0 10px 0;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
#userEnroll .crud-opts .crud-opts-right {
  margin-left: auto;
}
#userEnroll .org-tree-col {
  /*border-right: 1px solid #f5f5f5;*/
  height: 100%;
}
#userEnroll .user-list-col {
  border-left: 1px solid #f5f5f5;
  height: 100%;
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
/deep/ .my-box-card .vue-treeselect__control {
  height: 26px;
  line-height: 26px;
}
/deep/ .vue-treeselect__single-value,
/deep/ .vue-treeselect__placeholder {
  margin-top: -4px;
}
</style>
