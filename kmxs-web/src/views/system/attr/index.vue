<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template v-slot:left>
          <!-- 搜索 -->
          <el-select
            v-model="query.attrType"
            clearable
            placeholder="所属类型"
            class="filter-item ui-w-120"
            size="mini"
            @change="crud.toQuery()"
          >
            <el-option
              v-for="item in dict.sys_field_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right />
      </crudOperation>

      <!--表单组件-->
      <el-drawer
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        :size="viewWidth"
        append-to-body
        destroy-on-close
      >
        <div class="drawer__content">
          <div class="view-container inner-form">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="150px"
            >
              <el-form-item label="所属类型" prop="attrType">
                <el-select
                  v-model="form.attrType"
                  clearable
                  placeholder="请选择所属类型"
                  :style="itemWidth"
                >
                  <el-option
                    v-for="item in dict.sys_field_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="字段名称" prop="attrKey">
                <el-input
                  v-model="form.attrKey"
                  :style="itemWidth"
                  :disabled="crud.status.edit == 1"
                  placeholder="请输入字段名称"
                />
              </el-form-item>
              <el-form-item label="属性名称" prop="attrName">
                <el-input
                  v-model="form.attrName"
                  :style="itemWidth"
                  placeholder="请输入属性名称"
                />
              </el-form-item>
              <el-form-item label="属性状态" prop="status">
                <el-select
                  v-model="form.status"
                  clearable
                  placeholder="请选择属性状态"
                  :style="itemWidth"
                >
                  <el-option
                    v-for="item in dict.sys_disabled_status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="属性长度" prop="length">
                <el-input
                  v-model="form.length"
                  :style="itemWidth"
                  placeholder="请输入属性长度"
                />
              </el-form-item>
              <el-form-item label="属性类型" prop="component">
                <el-select
                  v-model="form.component"
                  clearable
                  placeholder="请选择属性类型"
                  :style="itemWidth"
                >
                  <el-option
                    v-for="item in dict.sys_attr_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item
                label=""
                prop="options"
                v-if="form.component == 'select'"
              >
                <div class="dialogLong">
                  <div
                    class="ui-flex ui-items-center long"
                    v-for="(item, index) in form.options"
                    :key="index"
                  >
                    <el-input
                      v-model="item.value"
                      class="ui-w-200 ui-mgr-5"
                      placeholder="绑定Key值"
                    />
                    <el-input
                      v-model="item.label"
                      class="ui-flex-1 ui-mgr-5"
                      placeholder="绑定昵称"
                    />
                    <i
                      class="
                        el-icon-circle-plus
                        ui-size-18 ui-cous ui-mgr-5
                        changebtn
                      "
                      @click="addOptions(index)"
                    ></i>
                    <i
                      v-if="form.options.length > 1"
                      class="el-icon-remove ui-size-18 ui-cous changebtn"
                      @click="reduceOptions(index)"
                    ></i>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="排序" prop="orderNum">
                <el-input
                  v-model="form.orderNum"
                  :style="itemWidth"
                  placeholder="请输入排序"
                />
              </el-form-item>
              <el-form-item label="新增时编辑" prop="editableInAdd">
                <el-radio-group v-model="form.editableInAdd" :style="itemWidth">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="新增时显示" prop="visibleInAdd">
                <el-radio-group v-model="form.visibleInAdd" :style="itemWidth">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="新增时必填" prop="requiredInAdd">
                <el-radio-group v-model="form.requiredInAdd" :style="itemWidth">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="编辑时编辑" prop="editableInEdit">
                <el-radio-group
                  v-model="form.editableInEdit"
                  :style="itemWidth"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="编辑时必填" prop="requiredInEdit">
                <el-radio-group
                  v-model="form.requiredInEdit"
                  :style="itemWidth"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="编辑时显示" prop="visibleInEdit">
                <el-radio-group v-model="form.visibleInEdit" :style="itemWidth">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="详情时显示" prop="visibleInDetail">
                <el-radio-group
                  v-model="form.visibleInDetail"
                  :style="itemWidth"
                >
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="属性说明" prop="remark">
                <el-input
                  v-model="form.remark"
                  :style="itemWidth"
                  placeholder="请输入属性说明"
                />
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="view-footer">
            <el-button @click="crud.cancelCU">取消</el-button>
            <el-button
              :loading="crud.cu === 2"
              type="primary"
              @click="crud.submitCU"
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
        <el-table-column type="selection" fixed="left" width="50" />
        <el-table-column prop="attrKey" label="字段名称" width="150" />
        <el-table-column prop="attrName" label="属性名称" width="150" />
        <el-table-column prop="attrType" label="所属类型" width="150">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.attrType, dict.sys_field_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="60">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="length" label="属性长度" width="100" />
        <el-table-column prop="component" label="属性类型" width="100">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.component, dict.sys_attr_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="60" />
        <el-table-column
          prop="remark"
          label="属性说明"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column prop="editableInAdd" label="新增时编辑" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.editableInAdd, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="visibleInAdd" label="新增时显示" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.visibleInAdd, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="requiredInAdd" label="新增时必填" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.requiredInAdd, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="visibleInEdit" label="编辑时显示" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.visibleInEdit, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="requiredInEdit" label="编辑时必填" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.requiredInEdit, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="editableInEdit" label="编辑时编辑" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.editableInEdit, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column prop="visibleInDetail" label="详情时显示" width="100">
          <template slot-scope="scope">
            {{
              $utils.getAlias(scope.row.visibleInDetail, sys_true_false_options)
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-permission="permission.edit"
          label="操作"
          width="80"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudAttr from "@http/system/attr";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import {
  validName,
  validFieldName,
  validNumber,
  validOrderNum,
  validDesc,
} from "@/utils/validate";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "拓展属性",
  url: "api/attr/all",
  crudMethod: { ...crudAttr },
  optShow: {
    status: true,
    add: true,
    edit: true,
    enable: true,
    disable: true,
    del: true,
  },
});
const defaultForm = {
  id: null,
  attrName: "",
  attrKey: "",
  attrType: "",
  remark: "",
  length: "",
  component: "",
  editableInAdd: true,
  visibleInAdd: true,
  requiredInAdd: false,
  editableInEdit: true,
  visibleInEdit: true,
  requiredInEdit: false,
  visibleInTag: true,
  visibleInDetail: true,
  orderNum: "0",
  status: "",
  options: [
    {
      label: "",
      value: "",
    },
  ],
};
export default {
  name: "attr",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_field_type", "sys_disabled_status", "sys_attr_type"],
  components: {
    pagination,
    crudOperation,
    udOperation,
    rrOperation,
  },
  data() {
    return {
      permission: {
        list: ["admin", "attr:list"],
        add: ["admin", "attr:add"],
        edit: ["admin", "attr:edit"],
        del: ["admin", "attr:del"],
        disable: ["admin", "attr:del"],
        enable: ["admin", "attr:del"],
      },
      viewWidth: "689px",
      itemWidth: "width:100%",
      rules: {
        attrType: [
          { required: true, message: "请选择所属类型", trigger: "change" },
        ],
        attrKey: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
          {
            trigger: "blur",
            validator: validFieldName,
          },
        ],
        attrName: [
          { required: true, message: "请输入属性名称", trigger: "blur" },
          { trigger: "blur", validator: validName },
        ],
        orderNum: [{ trigger: "blur", validator: validOrderNum }],
        remark: [{ trigger: "blur", validator: validDesc }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        length: [
          { required: true, message: "请输入长度", trigger: "blur" },
          { required: true, trigger: "blur", validator: validNumber },
        ],
        component: [
          { required: true, message: "请选择属性类型", trigger: "change" },
        ],
        editableInAdd: [
          { required: true, message: "请选择新增时编辑", trigger: "change" },
        ],
        visibleInAdd: [
          { required: true, message: "请选择新增时显示", trigger: "change" },
        ],
        requiredInAdd: [
          { required: true, message: "请选择新增时必填", trigger: "change" },
        ],
        editableInEdit: [
          { required: true, message: "请选择编辑时编辑", trigger: "change" },
        ],
        requiredInEdit: [
          { required: true, message: "请选择编辑时必填", trigger: "change" },
        ],
        visibleInEdit: [
          { required: true, message: "请选择编辑时显示", trigger: "change" },
        ],
        visibleInDetail: [
          { required: true, message: "请选择显示时显示", trigger: "change" },
        ],
      },
      sys_true_false_options: [
        {
          value: true,
          label: "是",
        },
        {
          value: false,
          label: "否",
        },
      ],
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:14:45
     * @Fn:增加选项
     */
    addOptions(idx) {
      this.form.options.splice(idx + 1, 0, {
        label: "",
        value: "",
      });
    },

    // 减少选项
    reduceOptions(idx) {
      this.form.options.splice(idx, 1);
    },
  },
};
</script>
