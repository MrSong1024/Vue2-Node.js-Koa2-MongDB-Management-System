<!--
 * @Author: Songjq
 * @Date: 2022-04-19 22:05:57
 * @Desscription: 岗位管理
-->
<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation
        :permission="permission"
        placeholder="请输入岗位编码/岗位名称"
      >
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
        width="560px"
        :append-to-body="true"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="岗位名称" prop="postName">
            <el-input
              size="small"
              v-model="form.postName"
              placeholder="请输入岗位名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="岗位编码" prop="postNo">
            <el-input
              size="small"
              v-model="form.postNo"
              placeholder="请输入岗位编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="岗位排序" prop="orderNum">
            <el-input-number
              size="small"
              v-model="form.orderNum"
              placeholder="请输入岗位排序"
              controls-position="right"
              class="w-100"
              :min="1"
              :max="999"
              label="label"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template v-for="(item, idx) in dict.sys_disabled_status">
              <el-radio :key="idx" v-model="form.status" :label="item.value">{{
                item.label
              }}</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
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
        <el-table-column type="selection" width="40" />
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column prop="postName" label="岗位名称" width="120">
        </el-table-column>
        <el-table-column prop="postNo" label="岗位编码" min-width="160">
        </el-table-column>
        <el-table-column prop="orderNum" label="岗位排序" min-width="100">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述" min-width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            ></udOperation>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import Post from "@http/system/post.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "用户",
  url: "api/post/all",
  crudMethod: { ...Post },
  optShow: { status: true, add: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  _id: null,
  postName: "",
  postNo: "",
  orderNum: 999,
  status: "",
  remark: "",
};

export default {
  name: "Post",
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
        list: ["admin", "post:list"],
        add: ["admin", "post:add"],
        edit: ["admin", "post:edit"],
        del: ["admin", "post:del"],
        enable: ["admin", "post:enable"],
        disable: ["admin", "post:disable"],
      },
      rules: {
        postName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
        ],
        postNo: [
          { required: true, message: "请输入岗位编码", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
