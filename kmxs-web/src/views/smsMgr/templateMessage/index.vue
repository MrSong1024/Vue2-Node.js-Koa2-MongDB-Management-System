<!--
 * @Author: Songjq
 * @Date: 2022-01-26 10:36:14
 * @Desscription: 短信模板
-->
<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入模板名称">
        <template v-slot:left>
          <el-select
            size="mini"
            v-model="query.status"
            placeholder="审核状态"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-w-120"
          >
            <el-option
              v-for="item in dict.sys_approval_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表单渲染-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="660px"
        :append-to-body="true"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="模板名称" prop="templateName">
            <el-input
              size="small"
              v-model="form.templateName"
              placeholder="请输入模板名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="模板签名" prop="templateSign">
            <el-input
              size="small"
              v-model="form.templateSign"
              placeholder="请输入模板签名"
            ></el-input>
          </el-form-item>
          <el-form-item label="模板类型" prop="templateType">
            <el-select
              v-model="form.templateType"
              placeholder="请选择"
              class="w-100"
            >
              <el-option
                v-for="item in dict.sys_sms_template_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板内容" prop="templateContent">
            <el-input
              type="textarea"
              v-model="form.templateContent"
              placeholder="请输入模板内容"
              @change="getSmsInfo()"
            ></el-input>
          </el-form-item>
          <el-form-item label="变量内容" prop="variable">
            <el-input
              type="textarea"
              placeholder="示例：变量1：姓名 变量2：公司名称 变量3：职位"
              v-model="form.variable"
            ></el-input>
          </el-form-item>
          <el-form-item label="字数统计" prop="smsInfo">
            {{ `${form.smsLength}个字符，拆分${form.smsCounts}条短信` }}
          </el-form-item>
          <el-form-item label="审核状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择"
              class="w-100"
              :disabled="crud.status.add == 1"
            >
              <el-option
                v-for="item in dict.sys_approval_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.btnLoading"
            type="primary"
            @click="crud.submitCU"
            >确认</el-button
          >
        </span>
      </el-dialog>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        height="calc(100vh - 180px)"
        border
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" />
        <el-table-column label="模板ID" prop="templateId" width="100" />
        <el-table-column label="模板签名" prop="templateSign" width="150" />
        <el-table-column label="模板名称" prop="templateName" width="150" />
        <el-table-column label="模板类型" prop="templateType" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(
                scope.row.templateType,
                dict.sys_sms_template_type
              )
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="templateContent"
          label="模板内容"
          show-overflow-tooltip
          width="320"
        />
        <el-table-column prop="status" label="审核状态" width="100">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.status, dict.sys_approval_status) }}
          </template>
        </el-table-column>
        <el-table-column prop="variable" label="变量说明" width="120" />
        <el-table-column prop="smsInfo" label="字数统计" width="160" />
        <el-table-column prop="createTime" label="创建时间" width="150">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission">
              <template v-slot:menu>
                <el-button
                  type="text"
                  @click="relationIdFn(scope.row)"
                  :disabled="!!scope.row.templateId"
                  v-permission="permission.edit"
                  >绑定模板ID</el-button
                >
              </template>
            </udOperation>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import Template, { postTemplateBinding } from "@http/sms/template.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "短信模板",
  url: "api/sms/template/all",
  crudMethod: { ...Template },
  optShow: { add: true, user: true, del: true },
});

const defaultForm = {
  _id: null,
  createBy: "", // 创建者
  templateName: "", // 名称
  templateSign: "", // 模板签名
  templateContent: "", // 短信内容
  templateType: "0", // 模板类型
  variable: "", // 变量
  status: "1", // 审核状态
  smsInfo: "", // 模板详情
  smsLength: "", // 字符长度
  smsCounts: "", // 短信条数
  remark: "", // 备注
};

export default {
  name: "order",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  components: { pagination, crudOperation, udOperation, rrOperation },
  dicts: ["sys_approval_status", "sys_sms_template_type"],
  data() {
    return {
      permission: {
        user: ["admin", "template:user"],
        list: ["admin", "template:list"],
        add: ["admin", "template:add"],
        edit: ["admin", "template:edit"],
        del: ["admin", "template:del"],
      },
      rules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
        ],
        templateSign: [
          { required: true, message: "请输入模板签名", trigger: "blur" },
        ],
        templateContent: [
          { required: true, message: "请输入模板内容", trigger: "blur" },
        ],
        templateType: [
          { required: true, message: "请选择模板类型", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    /**
     * 绑定模板ID
     */
    relationIdFn(row) {
      this.$prompt("绑定模板ID", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-9]*$/,
        inputPlaceholder: "输入模板ID",
        inputErrorMessage: "ID格式不正确（非空、限数字）",
      })
        .then(({ value }) => {
          // 编辑绑定
          if (value) {
            postTemplateBinding({
              _id: row._id,
              templateId: value,
            }).then((res) => {
              this.$message.success("操作成功");
              this.crud.toQuery();
            });
          } else {
            this.$message.error("模板ID不能为空");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消绑定",
          });
        });
    },

    // 统计模板字数
    getSmsInfo() {
      this.form.smsLength = this.form.templateContent.length;
      this.form.smsCounts = Math.ceil(this.form.templateContent.length / 60);
      this.form.smsInfo = `${this.form.templateContent.length}个字符,拆分${this.form.smsCounts}条短信`;
    },
  },
};
</script>
<style lang="scss"></style>