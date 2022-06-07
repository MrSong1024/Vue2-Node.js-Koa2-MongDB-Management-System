<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入标题">
        <template v-slot:left>
          <el-select
            size="mini"
            v-model="query.type"
            placeholder="通知类型"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-w-120"
          >
            <el-option
              v-for="item in dict.sys_notice_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right>
          <el-button
            v-permission="permission.add"
            class="filter-item"
            size="mini"
            type="primary"
            icon="el-icon-plus"
            @click="toAddFn"
          >
            新增
          </el-button>
        </template>
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
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="100px"
        >
          <el-form-item label="公告标题" prop="noticeTitle">
            <el-input
              size="small"
              v-model="form.noticeTitle"
              placeholder="请输入公告标题"
            ></el-input>
          </el-form-item>
          <el-form-item label="公告类型" prop="noticeType">
            <el-select
              v-model="form.noticeType"
              placeholder="请选择公告类型"
              class="w-100"
            >
              <el-option
                v-for="item in dict.sys_notice_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template v-for="(item, idx) in dict.sys_disabled_status">
              <el-radio :key="idx" v-model="form.status" :label="item.value">{{
                item.label
              }}</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="内容" prop="noticeContent">
            <editor
              ref="editor"
              v-if="crud.status.cu > 0"
              @change="setNoticeContent"
              :editorContent="form.noticeContent"
              :isMenu="false"
            />
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
        style="width: 100%"
        border
        height="calc(100vh - 180px)"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column label="序号" type="index" width="55"></el-table-column>
        <el-table-column
          prop="noticeTitle"
          label="公告标题"
          min-width="200"
        ></el-table-column>
        <el-table-column prop="noticeType" label="公告类型" min-width="80">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.noticeType, dict.sys_notice_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" width="100">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="toEditFn(scope.row)"
              v-permission="permission.edit"
              >修改</el-button
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
import Notice from "@http/information/notice.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import Editor from "@/views/components/Editor.vue";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "通知公告",
  url: "api/notice/all",
  crudMethod: { ...Notice },
  optShow: { user: true, status: true, del: true },
});

const defaultForm = {
  _id: null,
  noticeTitle: "",
  noticeType: "",
  status: "",
  noticeContent: "",
};

export default {
  name: "Notice",
  components: { pagination, crudOperation, udOperation, Editor, rrOperation },
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_notice_type", "sys_disabled_status"],
  data() {
    return {
      permission: {
        user: ["admin", "notice:user"],
        list: ["admin", "notice:list"],
        add: ["admin", "notice:add"],
        edit: ["admin", "notice:edit"],
        del: ["admin", "notice:del"],
      },
      rules: {
        noticeTitle: [
          { required: true, message: "请输入公告标题", trigger: "blur" },
        ],
        noticeType: [
          { required: true, message: "请选择公告类型", trigger: "change" },
        ],
        noticeContent: [
          { required: true, message: "请输入内容", trigger: "blur" },
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

    // 新增初始化
    toAddFn() {
      this.crud.toAdd();
      this.$nextTick(() => {
        this.$refs.editor.init();
      });
    },

    // 编辑初始化
    toEditFn(row) {
      this.crud.toEdit(row);
      this.$nextTick(() => {
        this.$refs.editor.init(JSON.parse(JSON.stringify(row)));
      });
    },

    // 设置公告内容
    setNoticeContent(html) {
      this.crud.form.noticeContent = html;
    },
  },
};
</script>
<style lang="scss"></style>