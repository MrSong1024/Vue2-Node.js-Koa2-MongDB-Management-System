<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入用户名/账号">
        <template v-slot:left>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表单渲染-->
      <el-drawer
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        size="689px"
        append-to-body
        destroy-on-close
      >
        <div class="drawer__content">
          <div class="view-container inner-form">
            <!-- 常量属性 - 表单 -->
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="100px"
            >
              <el-form-item label="账号" prop="userno">
                <el-input
                  :disabled="crud.status.edit == 1"
                  v-model="form.userno"
                  placeholder="请输入账号"
                ></el-input>
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="form.username"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
              <el-form-item label="角色" prop="role">
                <el-select
                  class="w-100"
                  v-model="form.role"
                  placeholder="请选择"
                >
                  <template v-for="(item, index) in role_types">
                    <el-option
                      :key="index"
                      :label="item.roleName"
                      :value="item.roleKey"
                    ></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="所属部门">
                <select-org-trees
                  treeId="department"
                  treeName="departmentAlias"
                  requestUrlType="isDepts"
                  popoverWidth="420"
                  :itm="form"
                  class="w-100"
                />
              </el-form-item>
              <el-form-item label="所属岗位">
                <el-select
                  v-model="form.post"
                  placeholder="请选择"
                  class="w-100"
                >
                  <el-option
                    v-for="item in postOptions"
                    :key="item.postNo"
                    :label="item.postName"
                    :value="item.postNo"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="短信价格" prop="smsPrice">
                <el-input-number
                  :disabled="!checkPermission(permission.user)"
                  controls-position="right"
                  class="w-100"
                  v-model="form.smsPrice"
                  :min="0.1"
                  placeholder="短信价格"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <template v-for="(item, idx) in dict.sys_disabled_status">
                  <el-radio
                    :key="idx"
                    v-model="form.status"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </template>
              </el-form-item>
              <el-form-item label="描述" prop="desc" class="w-100">
                <el-input type="textarea" v-model="form.desc"></el-input>
              </el-form-item>
            </el-form>
            <!-- 自定义属性 - 表单 -->
            <el-form
              ref="attribute"
              :model="crud.attribute"
              label-width="100px"
            >
              <template v-for="itm in crud.attributeOptions">
                <el-form-item
                  v-if="
                    (crud.status.edit == 1 && itm.visibleInEdit) ||
                    (crud.status.add == 1 && itm.visibleInAdd)
                  "
                  :key="itm._id"
                  :label="itm.attrName"
                  :prop="itm.attrKey"
                  :rules="[
                    {
                      required:
                        (crud.status.edit == 1 && itm.requiredInEdit) ||
                        (crud.status.add == 1 && itm.requiredInAdd),
                      message: itm.attrName + '为必填',
                      trigger: ['blur', 'change'],
                    },
                    {
                      max: Number(itm.length),
                      message: '最大长度' + itm.length + '个字符',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <template v-if="itm.component == 'input'">
                    <el-input
                      v-model="crud.attribute[itm.attrKey]"
                      :placeholder="'请输入' + itm.attrName"
                      :disabled="
                        (crud.status.edit == 1 && !itm.editableInEdit) ||
                        (crud.status.add == 1 && !itm.editableInAdd)
                      "
                    />
                  </template>
                  <template v-else-if="itm.component == 'select'">
                    <el-select
                      v-model="crud.attribute[itm.attrKey]"
                      class="w-100"
                      :placeholder="'请选择' + itm.attrName"
                      :disabled="
                        (crud.status.edit == 1 && !itm.editableInEdit) ||
                        (crud.status.add == 1 && !itm.editableInAdd)
                      "
                    >
                      <el-option
                        v-for="item in itm.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-form-item>
              </template>
            </el-form>
          </div>
          <div slot="footer" class="view-footer">
            <el-button @click="crud.cancelCU">取消</el-button>
            <el-button
              :loading="crud.btnLoading"
              type="primary"
              @click="submitAttribute()"
              >确认</el-button
            >
          </div>
        </div>
      </el-drawer>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        height="calc(100vh - 180px)"
        border
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="120">
        </el-table-column>
        <el-table-column prop="userno" label="账号" width="160">
        </el-table-column>
        <el-table-column prop="role" label="角色" width="150">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.role, role_types, "roleKey", "roleName")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="150">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.role, role_types, "roleKey", "roleName")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160">
        </el-table-column>
        <el-table-column prop="desc" label="描述" min-width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              v-permission="permission.edit"
              type="text"
              @click="crud.toEdit(scope.row)"
              >编辑</el-button
            >

            <el-button
              type="text"
              @click="resetPwdFn(scope.row)"
              v-permission="permission.reset"
              >重置密码</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import { getAttrAll } from "@http/system/attr.js";
import { getPostAll } from "@http/system/post.js";
import Users, { postUsersResetPwd } from "@http/system/user.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import { getRoleAll } from "@http/system/role.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "用户",
  url: "api/users/all",
  crudMethod: { ...Users },
  optShow: { status: true, add: true, del: true, enable: true, disable: true },
  isHaveAttr: true, // 含有拓展属性
  attrType: "users", // 类型
});

const defaultForm = {
  _id: null,
  username: "",
  userno: "",
  email: "",
  role: "",
  desc: "",
  status: "",
  smsPrice: "",
  department: "",
  departmentAlias: "",
  post: "",
  extendAttrs: "",
};

export default {
  name: "Users",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_disabled_status"],
  components: { pagination, crudOperation, udOperation, rrOperation },
  data() {
    return {
      permission: {
        user: ["admin"],
        list: ["admin", "users:list"],
        add: ["admin", "users:add"],
        edit: ["admin", "users:edit"],
        del: ["admin", "users:del"],
        reset: ["admin", "users:reset"],
        enable: ["admin", "users:enable"],
        disable: ["admin", "users:disable"],
      },
      rules: {
        userno: [{ required: true, message: "请输入账号", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        role: [{ required: true, message: "请选择角色", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      // 角色
      role_types: [],
      // 岗位列表
      postOptions: [],
    };
  },
  created() {
    // 获取角色列表
    getRoleAll().then((res) => {
      this.role_types = res.data;
    });

    // 获取岗位列表
    getPostAll().then((res) => {
      this.postOptions = res.data;
    });

    // 获取拓展属性列表
    getAttrAll({
      attrType: this.crud.attrType,
      status: "0",
    }).then((res) => {
      this.crud.attributeOptions = res.data;
    });
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-12 12:47:26
     * @Fn: 重置密码
     */
    resetPwdFn(row) {
      this.$confirm("此操作将重置当前用户密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //点击确定的操作(调用接口)
          postUsersResetPwd({
            userId: row._id,
          }).then((res) => {
            this.$message.success("操作成功");
          });
        })
        .catch(() => {
          //取消的提示
          this.$message("取消操作");
        });
    },
  },
};
</script>
<style lang="scss" scoped></style>
