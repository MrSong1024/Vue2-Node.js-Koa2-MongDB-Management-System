<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入名称">
        <template v-slot:left>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表单渲染-->
      <el-dialog
        destroy-on-close
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="660px"
        :append-to-body="true"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="名称" prop="name">
            <el-input
              size="small"
              v-model="form.name"
              placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="访问IP起" prop="ipStart">
            <el-input
              size="small"
              v-model="form.ipStart"
              placeholder="请输入访问IP起"
            ></el-input>
          </el-form-item>
          <el-form-item label="访问IP止" prop="ipEnd">
            <el-input
              size="small"
              v-model="form.ipEnd"
              placeholder="请输入访问IP止"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template v-for="(item, idx) in dict.sys_disabled_status">
              <el-radio :key="idx" v-model="form.status" :label="item.value">{{
                item.label
              }}</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.btnLoading" type="primary" @click="submit()"
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
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="name" label="名称" width="160">
        </el-table-column>
        <el-table-column prop="ipStart" label="访问IP起" width="160">
        </el-table-column>
        <el-table-column prop="ipEnd" label="访问IP止" width="160">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          show-overflow-tooltip
          label="备注"
          min-width="150"
        >
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
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
import Black from "@http/login/black.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import { validateIP } from "@/utils/validate";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "IP白名单",
  url: "api/black/all",
  crudMethod: { ...Black },
  optShow: { add: true, status: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  _id: null,
  name: "",
  ipStart: "",
  ipEnd: "",
  orderNum: 999,
  status: "0",
  remark: "",
};

export default {
  name: "black",
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
        list: ["admin", "black:list"],
        add: ["admin", "black:add"],
        edit: ["admin", "black:edit"],
        del: ["admin", "black:del"],
        enable: ["admin", "black:enable"],
        disable: ["admin", "black:disable"],
      },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        ipStart: [
          { required: true, message: "请输入访问IP起", trigger: "blur" },
          {
            trigger: "blur",
            validator: validateIP,
          },
        ],
        ipEnd: [
          { required: true, message: "请输入访问IP止", trigger: "blur" },
          {
            trigger: "blur",
            validator: validateIP,
          },
        ],
      },
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    // 提交代码 验证IP段
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const isGo = this.$utils.ip_right(this.form.ipStart, this.form.ipEnd);
          if (isGo) {
            this.crud.submitCU();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>

