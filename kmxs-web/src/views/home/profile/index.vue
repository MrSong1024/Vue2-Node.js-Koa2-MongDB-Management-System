<!--
 * @Author: Songjq
 * @Date: 2022-01-26 14:05:45
 * @Desscription: 
-->
<template>
  <div class="profile-info">
    <div class="content ui-flex">
      <div class="left">
        <div class="left-h">
          <div class="head">
            <users-avatar :user="userform" />
          </div>
          <h4>{{ userform.username }}</h4>
          <p>
            {{
              $utils.getAlias(userform.post, postOptions, "postNo", "postName")
            }}
          </p>
        </div>

        <div class="l-cell ui-flex">
          <div class="label"><svg-icon icon-class="anq" /> 安全等级</div>
          <el-tooltip class="item" effect="light" placement="top">
            <div slot="content" class="tips">
              存在风险：完成基础注册<br />一般：完成手机、邮箱填写<br />安全：完成手机、邮箱填写及实名认证
            </div>
            <span
              :class="
                userform.safety == '0'
                  ? 'czfx'
                  : userform.safety == '2'
                  ? 'aq'
                  : ''
              "
              >{{
                $utils.getAlias(userform.safety, dict.sys_safety_level)
              }}</span
            >
          </el-tooltip>
        </div>
        <div class="l-cell ui-flex">
          <div class="label"><svg-icon icon-class="validCode" /> 认证状态</div>
          <span
            @click="fn_certification()"
            class="sm"
            v-if="userform.authentication"
            >{{ userform.authInfo && userform.authInfo.name }}</span
          >
          <span @click="fn_certification()" class="czfx" v-else>未实名</span>
        </div>
      </div>
      <div class="right ui-flex-1 ui-mgr-40 ui-mgt-30">
        <div class="ui-flex ui-mgb-20">
          <div class="ui-flex-1"></div>
          <template v-if="isEdit">
            <el-button type="primary" @click="submit()" :loading="btnLoading"
              >保存</el-button
            >
            <el-button @click="isEdit = false">重置</el-button>
          </template>
          <el-button v-else type="primary" @click="isEdit = true"
            >编辑</el-button
          >
        </div>
        <el-form
          ref="userform"
          :model="userform"
          label-width="150px"
          class="ui-flex ui-flex-wrap profile-form"
        >
          <el-form-item label="用户昵称" class="w-50">
            <el-input
              v-model="userform.username"
              placeholder="用户昵称"
              size="small"
              v-if="isEdit"
            ></el-input>
            <span v-else>
              {{ userform.username }}
            </span>
          </el-form-item>
          <el-form-item label="用户账号" class="w-50">
            <span>
              {{ userform.userno }}
            </span>
          </el-form-item>
          <el-form-item label="密码" class="w-50">
            <div class="ui-flex ui-items-center">
              <span class="ui-h-32"> ************ </span>
              <i
                class="el-icon-edit-outline ui-cous ui-mgl-10"
                @click="fn_changePassword()"
              ></i>
            </div>
          </el-form-item>
          <el-form-item label="账号状态" class="w-50">
            <span>
              {{ $utils.getAlias(userform.status, dict.sys_disabled_status) }}
            </span>
          </el-form-item>
          <el-form-item label="身份证号" class="w-50">
            <span>
              {{ userform.idCard }}
            </span>
          </el-form-item>
          <el-form-item label="性别" class="w-50">
            <el-select
              v-model="userform.gender"
              placeholder="请选择"
              v-if="isEdit"
              class="w-100"
              size="small"
            >
              <el-option
                v-for="item in dict.sys_gender_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span v-else>
              {{ $utils.getAlias(userform.gender, dict.sys_gender_type) }}
            </span>
          </el-form-item>
          <el-form-item label="所属角色" class="w-50">
            <span>
              {{
                $utils.getAlias(
                  userform.role,
                  roleTypeOptions,
                  "roleKey",
                  "roleName"
                )
              }}
            </span>
          </el-form-item>
          <el-form-item label="所属部门" class="w-50">
            <select-org-trees
              v-if="isEdit"
              treeId="department"
              treeName="departmentAlias"
              requestUrlType="isDepts"
              :itm="userform"
            />
            <span v-else>
              {{ userform.departmentAlias }}
            </span>
          </el-form-item>
          <el-form-item label="所属岗位" class="w-50">
            <el-select
              v-model="userform.post"
              placeholder="请选择"
              v-if="isEdit"
              class="w-100"
              size="small"
            >
              <el-option
                v-for="item in postOptions"
                :key="item.postNo"
                :label="item.postName"
                :value="item.postNo"
              >
              </el-option>
            </el-select>
            <span v-else>
              {{
                $utils.getAlias(
                  userform.post,
                  postOptions,
                  "postNo",
                  "postName"
                )
              }}
            </span>
          </el-form-item>
          <el-form-item label="手机号码" class="w-50">
            <div class="ui-flex ui-items-center">
              <span class="ui-h-32">
                {{ userform.phone }}
              </span>
              <i
                class="el-icon-edit-outline ui-cous"
                :style="userform.phone ? 'margin-left:10px' : ''"
                @click="fn_changeUserPhone()"
              ></i>
            </div>
          </el-form-item>

          <el-form-item label="用户邮箱" class="w-50">
            <div class="ui-flex ui-items-center">
              <span class="ui-h-32">
                {{ userform.email }}
              </span>
              <i
                class="el-icon-edit-outline ui-cous"
                :style="userform.email ? 'margin-left:10px' : ''"
                @click="fn_changeUserEmail()"
              ></i>
            </div>
          </el-form-item>

          <template v-for="item in crud.attributeOptions">
            <el-form-item
              v-if="
                (isEdit && item.visibleInEdit) ||
                (!isEdit && item.visibleInDetail)
              "
              :key="item._id"
              :label="item.attrName"
              class="w-50"
            >
              <div class="ui-flex ui-items-center">
                <template v-if="item.component == 'input'">
                  <span class="ui-h-32">
                    {{ item.value }}
                  </span>
                </template>
                <template v-else-if="item.component == 'select'">
                  <span class="ui-h-32">
                    {{ $utils.getAlias(item.value, item.options) }}
                  </span>
                </template>
              </div>
            </el-form-item>
          </template>
          <el-form-item label="常驻地址" class="w-100">
            <el-input
              v-model="userform.address"
              placeholder="常驻地址"
              size="small"
              v-if="isEdit"
            ></el-input>
            <span v-else>
              {{ userform.address }}
            </span>
          </el-form-item>
          <el-form-item label="常用设备" class="w-100">
            <el-table :data="userform.browserInfos" stripe style="width: 100%">
              <el-table-column prop="browser" label="设备类型" width="150px">
              </el-table-column>
              <el-table-column
                prop="browserId"
                show-overflow-tooltip
                label="设备ID"
                min-width="180px"
              >
              </el-table-column>
              <el-table-column
                prop="location"
                min-width="150px"
                label="访问地址"
              >
              </el-table-column>
              <el-table-column prop="loginIp" min-width="150px" label="访问IP">
              </el-table-column>
              <el-table-column
                prop="loginDate"
                min-width="150px"
                label="访问时间"
              >
                <template slot-scope="scope">
                  {{ $utils.parseTime(scope.row.loginDate, "{y}-{m}-{d}") }}
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="60">
                <template slot-scope="scope">
                  <el-button
                    v-if="isEdit"
                    size="mini"
                    type="text"
                    @click="toInvalid(scope.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 重置密码 -->
    <reset-password ref="reset-password" @logout="logout()" />

    <!-- 换绑邮箱 -->
    <change-email ref="change-email" @init="getUser" />

    <!-- 换绑手机号 -->
    <change-phone ref="change-phone" @init="getUser" />

    <!-- 实名认证 -->
    <certification ref="certification" @init="getUser" />
  </div>
</template>

<script>
import { getAttrAll } from "@http/system/attr.js";
import publice from "@/mixins/publice.js";
import { getPostAll } from "@http/system/post.js";
import { getRoleAll } from "@http/system/role.js";
import ResetPassword from "./ResetPassword.vue";
import ChangeEmail from "./ChangeEmail.vue";
import ChangePhone from "./ChangePhone.vue";
import Certification from "./Certification.vue";
import UsersAvatar from "./UsersAvatar.vue";
import { getUserCurrentAll, edit } from "@/api/http/system/user";
import CRUD, { presenter } from "@crud/crud";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "用户中心",
  isHaveAttr: true, // 含有拓展属性
  attrType: "users", // 类型
});

export default {
  name: "Profile",
  dicts: ["sys_gender_type", "sys_disabled_status", "sys_safety_level"],
  components: {
    UsersAvatar,
    ResetPassword,
    ChangeEmail,
    ChangePhone,
    Certification,
  },
  mixins: [presenter(defaultCrud), publice],
  data() {
    return {
      userform: {
        username: "",
        userno: "",
        status: "",
        avatar: "",
        idCard: "",
        gender: "",
        role: "",
        department: "",
        post: "",
        phone: "",
        email: "",
        address: "",
        authentication: "",
        safety: "",
      },
      // 是否编辑
      isEdit: false,
      // 角色列表
      roleTypeOptions: [],
      // 按钮提交
      btnLoading: false,
      // 岗位列表
      postOptions: [],
    };
  },
  created() {
    // 获取角色列表
    getRoleAll().then((res) => {
      this.roleTypeOptions = res.data;
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
      // 获取用户信息
      this.getUser();
    });
  },
  methods: {
    // 获取用户信息
    getUser() {
      getUserCurrentAll().then((res) => {
        this.userform = res.data;
        let extendAttrs = JSON.parse(res.data.extendAttrs);
        this.crud.attributeOptions.forEach((val) => {
          extendAttrs.forEach((v) => {
            if (val.attrKey == v.name) {
              val.value = v.value;
            }
          });
        });
      });
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-03 17:02:43
     * @Fn: 更换密码
     */
    fn_changePassword() {
      this.$refs["reset-password"].dialogVisible = true;
    },

    /**
     * @Author: Songjq
     * @Date: 2022-01-19 15:10:02
     * @Fn: 换绑邮箱
     */
    fn_changeUserEmail() {
      this.$refs["change-email"].dialogVisible = true;
    },

    /**
     * @Author: Songjq
     * @Date: 2022-02-09 17:23:42
     * @Fn: 换绑手机号
     */
    fn_changeUserPhone() {
      this.$refs["change-phone"].dialogVisible = true;
    },

    /**
     * @Author: Songjq
     * @Date: 2022-02-10 15:20:31
     * @Fn: 实名认证
     */
    fn_certification() {
      this.$refs["certification"].dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["certification"].init(this.userform);
      });
    },

    /**
     * 删除设备信息
     */
    toInvalid(index) {
      this.userform.browserInfos.splice(index, 1);
    },

    // 提交保存用户信息
    submit() {
      this.btnLoading = true;
      edit({
        ...this.userform,
        smsPrice: this.userform.finance.smsPrice,
      })
        .then((res) => {
          this.btnLoading = false;
          this.isEdit = false;
          this.$notify.success({
            title: res.message,
            duration: 5000,
          });
        })
        .catch((err) => {
          this.btnLoading = false;
          this.$notify.error({
            title: err.message,
            duration: 5000,
          });
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.tips {
  line-height: 18px;
}
.profile-info {
  height: calc(100vh - 80px);
  .content {
    height: 100%;
    .left {
      height: 100%;
      min-width: 300px;
      border-right: 1px solid #e4e5ef;
      .left-h {
        text-align: center;
        margin-bottom: 70px;
        .head {
          margin: 50px auto 20px auto;
          width: 100px;
          height: 100px;
          box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.08);
          border: 4px solid #ffffff;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        h4 {
          font-size: 24px;
          font-weight: bold;
        }
        p {
          color: #aaaaaa;
          line-height: 30px;
          font-size: 14px;
        }
      }
      .l-cell {
        font-size: 14px;
        margin-bottom: 15px;
        .label {
          text-align: right;
          width: 150px;
          padding-right: 30px;
        }
        .czfx {
          color: #f00;
          cursor: pointer;
        }
        .aq {
          color: #4dbd6b;
          cursor: pointer;
        }
        .sm {
          color: #0083ff;
          cursor: pointer;
        }
      }
    }
    .right {
      overflow: hidden;
    }
  }
}
/deep/.profile-form {
  .el-form-item__label {
    color: #aaaaaa;
  }
  .el-form-item__content {
    padding-left: 10px;
  }
  .el-icon-edit-outline {
    font-size: 16px;
    color: #0083ff;
  }
}
</style>
