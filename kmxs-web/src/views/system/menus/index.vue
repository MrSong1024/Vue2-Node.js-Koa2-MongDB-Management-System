<!--
 * @Author: Songjq
 * @Date: 2022-02-22 22:00:43
 * @Desscription: 
-->
<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入菜单名称">
        <template v-slot:left>
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
        destroy-on-close
        width="680px"
        :append-to-body="true"
      >
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="ui-flex ui-flex-wrap"
        >
          <el-form-item label="上级类目" prop="parentId" class="w-100">
            <select-org-trees
              treeId="parentId"
              treeName="parentName"
              popoverWidth="540"
              :itm="form"
            />
          </el-form-item>
          <el-form-item label="菜单类型" prop="menuType" class="w-50">
            <el-radio-group v-model="form.menuType">
              <el-radio label="M">目录</el-radio>
              <el-radio label="C">菜单</el-radio>
              <el-radio label="B">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="菜单图标"
            prop="icon"
            class="w-50"
            v-if="form.menuType != 'B'"
          >
            <el-popover
              placement="bottom-start"
              width="520"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input
                slot="reference"
                v-model="form.icon"
                class="w-100"
                placeholder="点击选择图标"
                readonly
              >
                <svg-icon
                  v-if="form.icon"
                  slot="prefix"
                  :icon-class="form.icon"
                  class="el-input__icon"
                  style="height: 32px; width: 16px"
                />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="是否隐藏" prop="hidden" class="w-50">
            <el-switch v-model="form.hidden"> </el-switch>
          </el-form-item>
          <el-form-item
            label="含有子级"
            prop="alwaysShow"
            class="w-50"
            v-if="form.menuType != 'B'"
          >
            <el-switch v-model="form.alwaysShow"> </el-switch>
          </el-form-item>
          <el-form-item
            :label="getNameStr(form.menuType)"
            prop="menuName"
            class="w-50"
          >
            <el-input
              size="small"
              v-model="form.menuName"
              placeholder="请输入菜单名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="权限标识" prop="permission" class="w-50">
            <el-input
              size="small"
              v-model="form.permission"
              placeholder="请输入权限标识"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="路由地址"
            prop="path"
            class="w-50"
            v-if="form.menuType != 'B'"
          >
            <el-input
              size="small"
              v-model="form.path"
              placeholder="请输入路由地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="显示顺序" prop="orderNum" class="w-50">
            <el-input-number
              size="small"
              v-model="form.orderNum"
              placeholder="请输入菜单顺序"
              controls-position="right"
              class="w-100"
              :min="1"
              :max="999"
              label="label"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="组件名称"
            prop="componentName"
            class="w-50"
            v-if="form.menuType == 'C'"
          >
            <el-input
              size="small"
              v-model="form.componentName"
              placeholder="请输入组件名称"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="组件路径"
            prop="component"
            class="w-50"
            v-if="form.menuType != 'B'"
          >
            <el-input v-model="form.component" placeholder="组件路径" />
          </el-form-item>
          <el-form-item
            label="默认路径"
            prop="redirect"
            class="w-50"
            v-if="form.menuType == 'M'"
          >
            <el-input v-model="form.redirect" placeholder="默认路径" />
          </el-form-item>
          <el-form-item label="状态" prop="status" class="w-50">
            <template v-for="(item, idx) in dict.sys_disabled_status">
              <el-radio :key="idx" v-model="form.status" :label="item.value">{{
                item.label
              }}</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="备注" prop="remark" class="w-100">
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
        height="calc(100vh - 140px)"
        border
        @selection-change="crud.selectionChangeHandler"
        row-key="_id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column prop="menuName" label="菜单名称" min-width="260">
        </el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="60px">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="菜单顺序"> </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="path"
          label="路由地址"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="permission"
          label="权限标识"
          width="150"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="component"
          label="组件路径"
          width="150"
        />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="hidden" label="隐藏">
          <template slot-scope="scope">
            <span v-if="scope.row.hidden">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            ></udOperation>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Menu from "@http/system/menu.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import publice from "@/mixins/publice.js";
import IconSelect from "@/components/IconSelect";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "用户",
  url: "api/menu/all",
  crudMethod: { ...Menu },
  optShow: { status: true, add: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  parentId: 0,
  parentName: "",
  menuType: "M",
  icon: "",
  hidden: false,
  alwaysShow: false,
  redirect: "",
  menuName: "",
  permission: "",
  path: "",
  orderNum: 999,
  componentName: "",
  component: "",
  status: "0",
  remark: "",
};

export default {
  name: "menus",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_disabled_status"],
  components: {
    IconSelect,
    crudOperation,
    udOperation,
    rrOperation,
  },
  data() {
    return {
      permission: {
        list: ["admin", "menus:list"],
        add: ["admin", "menus:add"],
        edit: ["admin", "menus:edit"],
        del: ["admin", "menus:del"],
        enable: ["admin", "menus:enable"],
        disable: ["admin", "menus:disable"],
      },
      rules: {
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
      },
      isEdit: false,
    };
  },

  methods: {
    // 选中图标
    selected(name) {
      this.form.icon = name;
    },
    // 获取标题名称
    getNameStr(type) {
      let str = "";

      switch (type) {
        case "M":
          str = "目录名称";
          break;

        case "C":
          str = "菜单名称";
          break;

        case "B":
          str = "按钮名称";
          break;
      }

      return str;
    },
  },
};
</script>
<style lang="scss"></style>
